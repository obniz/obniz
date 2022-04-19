"use strict";
/**
 * @packageDocumentation
 *
 * @ignore
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const ObnizError_1 = require("../../../../../ObnizError");
const bleHelper_1 = __importDefault(require("../../bleHelper"));
const crypto_1 = __importDefault(require("./crypto"));
/**
 * @ignore
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
var SMP;
(function (SMP) {
    SMP.CID = 0x0006;
    SMP.PAIRING_REQUEST = 0x01;
    SMP.PAIRING_RESPONSE = 0x02;
    SMP.PAIRING_CONFIRM = 0x03;
    SMP.PAIRING_RANDOM = 0x04;
    SMP.PAIRING_FAILED = 0x05;
    SMP.ENCRYPT_INFO = 0x06;
    SMP.MASTER_IDENT = 0x07;
    SMP.IDENTITY_INFORMATION = 0x08;
    SMP.IDENTITY_ADDRESS_INFORMATION = 0x09;
    SMP.SIGNING_INFORMATION = 0x0a;
    SMP.PAIRING_PUBLIC_KEY = 0x0c;
    SMP.PAIRING_DHKEY_CHECK = 0x0d;
    SMP.SMP_SECURITY_REQUEST = 0x0b;
})(SMP || (SMP = {}));
/**
 * @ignore
 */
class Smp extends eventemitter3_1.default {
    constructor(aclStream, localAddressType, localAddress, remoteAddressType, remoteAddress) {
        super();
        this._preq = null;
        this._pres = null;
        this._tk = null;
        this._r = null;
        this._rand = null;
        this._ediv = null;
        this._pcnf = null;
        this._stk = null;
        this._ltk = null;
        this._options = undefined;
        this.debugHandler = (...param) => {
            // do nothing.
            // console.log(...param);
        };
        this._aclStream = aclStream;
        this._iat = Buffer.from([localAddressType === 'random' ? 0x01 : 0x00]);
        this._ia = bleHelper_1.default.hex2reversedBuffer(localAddress, ':');
        this._rat = Buffer.from([remoteAddressType === 'random' ? 0x01 : 0x00]);
        this._ra = bleHelper_1.default.hex2reversedBuffer(remoteAddress, ':');
        this.onAclStreamDataBinded = this.onAclStreamData.bind(this);
        this.onAclStreamEndBinded = this.onAclStreamEnd.bind(this);
        this._aclStream.on('data', this.onAclStreamDataBinded);
        this._aclStream.on('end', this.onAclStreamEndBinded);
    }
    async pairingWithKeyWait(key) {
        this.debug(`Pairing using keys ${key}`);
        this.setKeys(key);
        if (!this._ltk || !this._rand || !this._ediv) {
            throw new Error('invalid keys');
        }
        console.log(this.parsePairingReqRsp(this._pres));
        const encResult = await this._aclStream.onSmpLtkWait(this._ltk, this._rand, this._ediv);
        return encResult;
    }
    setPairingOption(options) {
        this._options = options;
    }
    async pairingWait(options) {
        this._options = Object.assign(Object.assign({}, this._options), options);
        if (this._options && this._options.keys) {
            const result = await this.pairingWithKeyWait(this._options.keys);
            if (this._options && this._options.onPairedCallback) {
                this._options.onPairedCallback(this.getKeys());
            }
            return result;
        }
        // phase 1 : Pairing Feature Exchange
        this.debug(`Going to Pairing`);
        await this.sendPairingRequestWait();
        this.debug(`Waiting Pairing Response`);
        const pairingResponse = await this._readWait(SMP.PAIRING_RESPONSE);
        this.debug(`Receive  Pairing Response ${pairingResponse.toString('hex')}`);
        this._pres = pairingResponse;
        if (this.isSecureConnectionMode()) {
            // phase2 : (after receive PAIRING_RESPONSE)
            await this.handlePairingResponseSecureConnectionWait();
            console.log('paired');
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log('awaited paired');
        }
        else {
            // phase2 : (after receive PAIRING_RESPONSE)
            await this.handlePairingResponseLegacyPairingWait();
            this.debug(`Waiting Pairing Confirm`);
            const confirm = await this._readWait(SMP.PAIRING_CONFIRM, 60 * 1000); // 60sec timeout
            this.handlePairingConfirm(confirm);
            // phase3 : Transport Specific Key Distribution
            this.debug(`Waiting Pairing Random`);
            const random = await this._readWait(SMP.PAIRING_RANDOM);
            const encResultPromise = this.handlePairingRandomWait(random);
            this.debug(`Got Pairing Encryption Result`);
            const encInfoPromise = this._readWait(SMP.ENCRYPT_INFO);
            const masterIdentPromise = this._readWait(SMP.MASTER_IDENT);
            await Promise.all([encResultPromise, encInfoPromise, masterIdentPromise]);
            const encResult = await encResultPromise;
            const encInfo = await encInfoPromise;
            const masterIdent = await masterIdentPromise;
            this.handleEncryptInfo(encInfo);
            this.handleMasterIdent(masterIdent);
            if (encResult === 0) {
                throw new Error('Encrypt failed');
            }
        }
        if (this._options && this._options.onPairedCallback) {
            this._options.onPairedCallback(this.getKeys());
        }
    }
    onAclStreamData(cid, data) {
        if (cid !== SMP.CID) {
            return;
        }
        const code = data.readUInt8(0);
        if (SMP.PAIRING_FAILED === code) {
            this.handlePairingFailed(data);
        }
        else if (SMP.SMP_SECURITY_REQUEST === code) {
            this.handleSecurityRequest(data);
        }
        // console.warn("SMP: " + code);
    }
    onAclStreamEnd() {
        this._aclStream.removeListener('data', this.onAclStreamDataBinded);
        this._aclStream.removeListener('end', this.onAclStreamEndBinded);
        this.emit('end');
    }
    async handlePairingResponseLegacyPairingWait() {
        if (this.isPasskeyMode()) {
            let passkeyNumber = 0;
            passkeyNumber = await this._options.passkeyCallback();
            this.debug(`PassKey=${passkeyNumber}`);
            const passkey = new Array(16);
            for (let i = 0; i < 3; i++) {
                passkey[i] = (passkeyNumber >> (i * 8)) & 0xff;
            }
            this._tk = Buffer.from(passkey);
        }
        else {
            this._tk = Buffer.from('00000000000000000000000000000000', 'hex');
        }
        this._r = crypto_1.default.r();
        this.write(Buffer.concat([
            Buffer.from([SMP.PAIRING_CONFIRM]),
            crypto_1.default.c1(this._tk, this._r, this._pres, this._preq, this._iat, this._ia, this._rat, this._ra),
        ]));
    }
    async handlePairingResponseSecureConnectionWait() {
        // TODO: check peer device support sc.
        // const passkeyBit = new Array<boolean>(20);
        // for (let i = 0; i < 20; i++) {
        //   passkeyBit[i] = (passkeyNumber >> i) & 0x1 ? true : false;
        // }
        const ecdh = crypto_1.default.createECDHKey();
        const remoteKeyPromise = this._readWait(SMP.PAIRING_PUBLIC_KEY);
        this.write(Buffer.concat([Buffer.from([SMP.PAIRING_PUBLIC_KEY]), ecdh.x, ecdh.y]));
        const remoteKey = await remoteKeyPromise;
        const peerPublicKey = {
            x: remoteKey.slice(1, 33),
            y: remoteKey.slice(33, 65),
        };
        this.debug('got remote public key');
        const passkeyNumber = this.isPasskeyMode()
            ? await this._options.passkeyCallback()
            : 0;
        this.debug(`PassKey=${passkeyNumber}`);
        const rspConfirmBuffers = [];
        const rspRandomBuffers = [];
        const initRandomValue = crypto_1.default.randomBytes(16);
        for (let passkeyBitCounter = 0; passkeyBitCounter < 20; passkeyBitCounter++) {
            console.log('here' + passkeyBitCounter);
            const initConfirmValue = crypto_1.default.f4(ecdh.x, peerPublicKey.x, initRandomValue, ((passkeyNumber >> passkeyBitCounter) & 1) | 0x80);
            const remoteConfirmPromise = this._readWait(SMP.PAIRING_CONFIRM);
            this.write(Buffer.concat([Buffer.from([SMP.PAIRING_CONFIRM]), initConfirmValue]));
            console.log('write confirm' + passkeyBitCounter);
            const buf = await remoteConfirmPromise;
            console.log('get confirm' + passkeyBitCounter);
            rspConfirmBuffers.push(buf.slice(1));
            const remoteRamdomPromise = this._readWait(SMP.PAIRING_RANDOM);
            this.write(Buffer.concat([Buffer.from([SMP.PAIRING_RANDOM]), initRandomValue]));
            console.log('write random' + passkeyBitCounter);
            const buf2 = await remoteRamdomPromise;
            console.log('get random' + passkeyBitCounter);
            rspRandomBuffers.push(buf2.slice(1));
            console.log('finish' + passkeyBitCounter);
        }
        const res = crypto_1.default.generateLtkEaEb(ecdh.ecdh, peerPublicKey, this._ia, this._iat, this._ra, this._rat, initRandomValue, rspRandomBuffers[rspRandomBuffers.length - 1], passkeyNumber, 0x10, // max key size
        this._preq ? this._preq.slice(1, 4) : Buffer.alloc(3), this._pres ? this._pres.slice(1, 4) : Buffer.alloc(3));
        const remoteDhkeyPromise = this._readWait(SMP.PAIRING_DHKEY_CHECK);
        this.write(Buffer.concat([Buffer.from([SMP.PAIRING_DHKEY_CHECK]), res.Ea]));
        const buf3 = await remoteDhkeyPromise;
        const Eb = buf3.slice(1);
        console.log('got dhkey');
        const irkPromise = this._readWait(SMP.IDENTITY_INFORMATION);
        const bdAddrPromise = this._readWait(SMP.IDENTITY_ADDRESS_INFORMATION);
        this._ltk = res.ltk;
        this.emit('ltk', this._ltk);
        await this._aclStream.onSmpStkWait(this._ltk);
        const irkBuf = await irkPromise;
        const bdAddrBuf = await bdAddrPromise;
        // we dont have irk, so zero padding
        this.write(Buffer.concat([Buffer.from([SMP.IDENTITY_INFORMATION]), Buffer.alloc(16)]));
        this.write(Buffer.concat([
            Buffer.from([SMP.IDENTITY_ADDRESS_INFORMATION]),
            this._iat,
            this._ia,
        ]));
        this._rand = Buffer.alloc(8);
        this._ediv = Buffer.alloc(2);
        return res.ltk;
    }
    handlePairingConfirm(data) {
        var _a;
        this._pcnf = data;
        this.write(Buffer.concat([
            Buffer.from([SMP.PAIRING_RANDOM]),
            (_a = this._r, (_a !== null && _a !== void 0 ? _a : Buffer.alloc(0))),
        ]));
    }
    async handlePairingRandomWait(data) {
        const r = data.slice(1);
        let encResult = null;
        const pcnf = Buffer.concat([
            Buffer.from([SMP.PAIRING_CONFIRM]),
            crypto_1.default.c1(this._tk, r, this._pres, this._preq, this._iat, this._ia, this._rat, this._ra),
        ]);
        if (this._pcnf && this._pcnf.toString('hex') === pcnf.toString('hex')) {
            if (this._stk !== null) {
                console.error('second stk');
            }
            this._stk = crypto_1.default.s1(this._tk, r, this._r);
            // this.emit("stk", this._stk);
            encResult = await this._aclStream.onSmpStkWait(this._stk);
        }
        else {
            this.write(Buffer.from([SMP.PAIRING_RANDOM, SMP.PAIRING_CONFIRM]));
            this.emit('fail', 0);
            throw new Error('Encryption pcnf error');
        }
        return encResult;
    }
    handlePairingFailed(data) {
        this.emit('fail', data.readUInt8(1));
    }
    handleEncryptInfo(data) {
        this._ltk = data.slice(1);
        this.emit('ltk', this._ltk);
    }
    handleMasterIdent(data) {
        const ediv = data.slice(1, 3);
        const rand = data.slice(3);
        this._ediv = ediv;
        this._rand = rand;
        this.emit('masterIdent', ediv, rand);
    }
    write(data) {
        this._aclStream.write(SMP.CID, data);
    }
    handleSecurityRequest(data) {
        this.pairingWait()
            .then(() => {
            // do nothing.
        })
            .catch((e) => {
            if (this._options && this._options.onPairingFailed) {
                this._options.onPairingFailed(e);
            }
            else {
                throw e;
            }
        });
    }
    setKeys(keyStringBase64) {
        const keyString = Buffer.from(keyStringBase64, 'base64').toString('ascii');
        this.debug(`restored keys ${keyString}`);
        const keys = JSON.parse(keyString);
        this._stk = keys.stk ? Buffer.from(keys.stk, 'hex') : null;
        this._preq = keys.preq ? Buffer.from(keys.preq, 'hex') : null;
        this._pres = keys.pres ? Buffer.from(keys.pres, 'hex') : null;
        this._tk = keys.tk ? Buffer.from(keys.tk, 'hex') : null;
        this._r = keys.r ? Buffer.from(keys.r, 'hex') : null;
        this._pcnf = keys.pcnf ? Buffer.from(keys.pcnf, 'hex') : null;
        this._ltk = keys.ltk ? Buffer.from(keys.ltk, 'hex') : null;
        this._ediv = keys.ediv ? Buffer.from(keys.ediv, 'hex') : null;
        this._rand = keys.rand ? Buffer.from(keys.rand, 'hex') : null;
    }
    getKeys() {
        const keys = {
            stk: this._stk ? this._stk.toString('hex') : null,
            preq: this._preq ? this._preq.toString('hex') : null,
            pres: this._pres ? this._pres.toString('hex') : null,
            tk: this._tk ? this._tk.toString('hex') : null,
            r: this._r ? this._r.toString('hex') : null,
            pcnf: this._pcnf ? this._pcnf.toString('hex') : null,
            ltk: this._ltk ? this._ltk.toString('hex') : null,
            ediv: this._ediv ? this._ediv.toString('hex') : null,
            rand: this._rand ? this._rand.toString('hex') : null,
        };
        const jsonString = JSON.stringify(keys);
        const keyString = Buffer.from(jsonString, 'ascii').toString('base64');
        return keyString;
    }
    _generateAuthenticationRequirementsFlags(params) {
        let result = 0x00;
        if (params.bonding === 'Bonding') {
            result |= 0x01;
        }
        if (params.mitm) {
            result |= 0x04;
        }
        if (params.secureConnection) {
            result |= 0x08;
        }
        if (params.keypress) {
            result |= 0x10;
        }
        if (params.ct2) {
            result |= 0x20;
        }
        return result;
    }
    async sendPairingRequestWait() {
        if (this.isPasskeyMode()) {
            this.debug(`pair capable passkey`);
            this._preq = Buffer.from([
                SMP.PAIRING_REQUEST,
                0x02,
                0x00,
                this._generateAuthenticationRequirementsFlags({
                    bonding: 'Bonding',
                    mitm: true,
                    ct2: false,
                    keypress: false,
                    secureConnection: this.isSecureConnectionMode(),
                }),
                0x10,
                0x02,
                0x02,
            ]);
        }
        else {
            this.debug(`pair No Input and No Output`);
            this._preq = Buffer.from([
                SMP.PAIRING_REQUEST,
                0x03,
                0x00,
                this._generateAuthenticationRequirementsFlags({
                    bonding: 'Bonding',
                    mitm: false,
                    ct2: false,
                    keypress: false,
                    secureConnection: this.isSecureConnectionMode(),
                }),
                0x10,
                0x00,
                0x01,
            ]);
        }
        this.write(this._preq);
    }
    isPasskeyMode() {
        if (this._options && this._options.passkeyCallback) {
            return true;
        }
        return false;
    }
    isSecureConnectionMode() {
        if (this._options && this._options.secureConnection) {
            return true;
        }
        return false;
    }
    _readWait(flag, timeout) {
        return Promise.race([
            this._aclStream.readWait(SMP.CID, flag, timeout),
            this._pairingFailReject(),
        ]);
    }
    _pairingFailReject() {
        return new Promise((resolve, reject) => {
            this.on('fail', (reason) => {
                reject(new ObnizError_1.ObnizBlePairingRejectByRemoteError(reason));
            });
        });
    }
    debug(text) {
        console.log(`SMP: ${text}`);
    }
    parsePairingReqRsp(data) {
        return {
            ioCap: this.value2ioCapability(data[1]),
            bondingFlags: ((data[3] & 3) === 0
                ? 'NoBonding'
                : 'Bonding'),
            mitm: (data[3] & 4) !== 0,
            sc: (data[3] & 8) !== 0,
            keypress: (data[3] & 16) !== 0,
            maxKeySize: data[4],
            initKeyDistr: {
                encKey: (data[5] & 1) !== 0,
                idKey: (data[5] & 2) !== 0,
            },
            rspKeyDistr: {
                encKey: (data[6] & 1) !== 0,
                idKey: (data[6] & 2) !== 0,
            },
        };
    }
    ioCapability2value(capability) {
        switch (capability) {
            case 'displayOnly':
                return 0x00;
            case 'displayYesNo':
                return 0x01;
            case 'keyboardDisplay':
                return 0x04;
            case 'keyboardOnly':
                return 0x02;
        }
        return 0x03;
    }
    value2ioCapability(value) {
        const map = {
            0x00: 'displayOnly',
            0x01: 'displayYesNo',
            0x02: 'keyboardOnly',
            0x03: 'noInputNoOutput',
            0x04: 'keyboardDisplay',
        };
        if (map[value]) {
            return map[value];
        }
        throw new Error('unknown value');
    }
}
exports.default = Smp;
