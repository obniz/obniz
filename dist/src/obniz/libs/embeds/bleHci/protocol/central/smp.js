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
exports.Smp = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const ObnizError_1 = require("../../../../../ObnizError");
const bleHelper_1 = __importDefault(require("../../bleHelper"));
const crypto_1 = __importDefault(require("../common/crypto"));
const smp_1 = require("../common/smp");
const serial_executor_1 = require("@9wick/serial-executor");
/**
 * @ignore
 */
class Smp extends eventemitter3_1.default {
    constructor(aclStream, localAddressType, localAddress, remoteAddressType, remoteAddress) {
        super();
        this._preq = null; // pairing Request buffer
        this._pres = null; // pairing Response buffer
        this._pairingFeature = null; // conbine (pairing Request & pairing Response)
        this._tk = null;
        this._r = null;
        this._rand = null;
        this._ediv = null;
        this._pcnf = null;
        this._stk = null;
        this._ltk = null;
        this._options = undefined;
        this._smpCommon = new smp_1.SmpCommon();
        this._serialExecutor = (0, serial_executor_1.createSerialExecutor)();
        this._pairingPromise = null;
        this.debugHandler = (...param) => {
            // do nothing.
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
        // console.log(this._smpCommon.parsePairingReqRsp(this._pres!));
        const encResult = await this._aclStream.onSmpLtkWait(this._ltk, this._rand, this._ediv);
        return encResult;
    }
    setPairingOption(options) {
        this._options = options;
    }
    async pairingWait(options) {
        // allow only once for connection
        if (this._pairingPromise) {
            return await this._pairingPromise;
        }
        this._pairingPromise = this._serialExecutor.execute(async () => {
            return await this.pairingSingleQueueWait(options);
        });
        return await this._pairingPromise;
    }
    async pairingSingleQueueWait(options) {
        this._options = Object.assign(Object.assign({}, this._options), options);
        // if already paired
        if (this.hasKeys()) {
            if (this._options && this._options.onPairedCallback) {
                this._options.onPairedCallback(this.getKeys());
            }
            return;
        }
        if (this._options && this._options.keys) {
            const result = await this.pairingWithKeyWait(this._options.keys);
            if (this._options && this._options.onPairedCallback) {
                this._options.onPairedCallback(this.getKeys());
            }
            return;
        }
        // phase 1 : Pairing Feature Exchange
        this.debug(`Going to Pairing`);
        await this.sendPairingRequestWait();
        this.debug(`Waiting Pairing Response`);
        const pairingResponse = await this._readWait(smp_1.SMP.PAIRING_RESPONSE);
        this.debug(`Receive  Pairing Response ${pairingResponse.toString('hex')}`);
        this._pres = pairingResponse;
        const parsedPairingRequest = this._smpCommon.parsePairingReqRsp(this._preq);
        const parsedPairingResponse = this._smpCommon.parsePairingReqRsp(this._pres);
        this._pairingFeature = this._smpCommon.combinePairingParam(parsedPairingRequest, parsedPairingResponse);
        if (this.isSecureConnectionMode()) {
            if (!this._pairingFeature.sc) {
                throw new ObnizError_1.ObnizBleUnSupportedPeripheralError('secure connection');
            }
            // phase2 : (after receive PAIRING_RESPONSE)
            await this.handlePairingResponseSecureConnectionWait();
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        else {
            // phase2 : (after receive PAIRING_RESPONSE)
            await this.handlePairingResponseLegacyPairingWait();
            this.debug(`Waiting Pairing Confirm`);
            const confirm = await this._readWait(smp_1.SMP.PAIRING_CONFIRM, 60 * 1000); // 60sec timeout
            this.handlePairingConfirm(confirm);
            // phase3 : Transport Specific Key Distribution
            this.debug(`Waiting Pairing Random`);
            const random = await this._readWait(smp_1.SMP.PAIRING_RANDOM);
            const encResultPromise = this.handlePairingRandomWait(random);
            this.debug(`Got Pairing Encryption Result`);
            const encInfoPromise = this._readWait(smp_1.SMP.ENCRYPT_INFO);
            const masterIdentPromise = this._readWait(smp_1.SMP.MASTER_IDENT);
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
        if (cid !== smp_1.SMP.CID) {
            return;
        }
        const code = data.readUInt8(0);
        if (smp_1.SMP.PAIRING_FAILED === code) {
            this.handlePairingFailed(data);
        }
        else if (smp_1.SMP.SMP_SECURITY_REQUEST === code) {
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
            Buffer.from([smp_1.SMP.PAIRING_CONFIRM]),
            crypto_1.default.c1(this._tk, this._r, this._pres, this._preq, this._iat, this._ia, this._rat, this._ra),
        ]));
    }
    async handlePairingResponseSecureConnectionWait() {
        var _a, _b, _c;
        const ecdh = crypto_1.default.createECDHKey();
        const usePasskey = ((_a = this._pairingFeature) === null || _a === void 0 ? void 0 : _a.association) === 'PasskeyEntryRspInputs' ||
            ((_b = this._pairingFeature) === null || _b === void 0 ? void 0 : _b.association) === 'PasskeyEntryBothInputs' ||
            ((_c = this._pairingFeature) === null || _c === void 0 ? void 0 : _c.association) === 'PasskeyEntryInitInputs';
        const remoteKeyPromise = this._readWait(smp_1.SMP.PAIRING_PUBLIC_KEY);
        const remoteConfirmForJustWorksPromise = usePasskey
            ? null
            : this._readWait(smp_1.SMP.PAIRING_CONFIRM);
        this.write(Buffer.concat([Buffer.from([smp_1.SMP.PAIRING_PUBLIC_KEY]), ecdh.x, ecdh.y]));
        const remoteKey = await remoteKeyPromise;
        const peerPublicKey = {
            x: remoteKey.slice(1, 33),
            y: remoteKey.slice(33, 65),
        };
        this.debug('got remote public key');
        let passkeyNumber = 0;
        if (usePasskey) {
            passkeyNumber = await this._options.passkeyCallback();
            this.debug(`PassKey=${passkeyNumber}`);
            if (passkeyNumber < 0 || passkeyNumber > 999999) {
                throw new ObnizError_1.ObnizBleInvalidPasskeyError(passkeyNumber);
            }
        }
        const rspConfirmBuffers = [];
        const rspRandomBuffers = [];
        const initRandomValue = crypto_1.default.randomBytes(16);
        if (!usePasskey) {
            this.debug(`pairing confirm only once`);
            const buf = await remoteConfirmForJustWorksPromise;
            rspConfirmBuffers.push(buf.slice(1));
            const remoteRamdomPromise = this._readWait(smp_1.SMP.PAIRING_RANDOM);
            this.write(Buffer.concat([Buffer.from([smp_1.SMP.PAIRING_RANDOM]), initRandomValue]));
            const buf2 = await remoteRamdomPromise;
            rspRandomBuffers.push(buf2.slice(1));
        }
        else {
            for (let passkeyBitCounter = 0; passkeyBitCounter < 20; passkeyBitCounter++) {
                this.debug(`pairing confirm loop:${passkeyBitCounter}`);
                const remoteConfirmPromise = this._readWait(smp_1.SMP.PAIRING_CONFIRM);
                const initConfirmValue = crypto_1.default.f4(ecdh.x, peerPublicKey.x, initRandomValue, ((passkeyNumber >> passkeyBitCounter) & 1) | 0x80);
                this.write(Buffer.concat([Buffer.from([smp_1.SMP.PAIRING_CONFIRM]), initConfirmValue]));
                const buf = await remoteConfirmPromise;
                rspConfirmBuffers.push(buf.slice(1));
                const remoteRamdomPromise = this._readWait(smp_1.SMP.PAIRING_RANDOM);
                this.write(Buffer.concat([Buffer.from([smp_1.SMP.PAIRING_RANDOM]), initRandomValue]));
                const buf2 = await remoteRamdomPromise;
                rspRandomBuffers.push(buf2.slice(1));
            }
        }
        const res = crypto_1.default.generateLtkEaEb(ecdh.ecdh, peerPublicKey, this._ia, this._iat, this._ra, this._rat, initRandomValue, rspRandomBuffers[rspRandomBuffers.length - 1], passkeyNumber !== null && passkeyNumber !== void 0 ? passkeyNumber : 0, 0x10, // max key size
        this._preq ? this._preq.slice(1, 4) : Buffer.alloc(3), this._pres ? this._pres.slice(1, 4) : Buffer.alloc(3));
        const remoteDhkeyPromise = this._readWait(smp_1.SMP.PAIRING_DHKEY_CHECK);
        this.debug(`send PAIRING_DHKEY_CHECK`);
        this.write(Buffer.concat([Buffer.from([smp_1.SMP.PAIRING_DHKEY_CHECK]), res.Ea]));
        const buf3 = await remoteDhkeyPromise;
        this.debug(`receive PAIRING_DHKEY_CHECK`);
        const Eb = buf3.slice(1);
        const irkPromise = this._readWait(smp_1.SMP.IDENTITY_INFORMATION);
        const bdAddrPromise = this._readWait(smp_1.SMP.IDENTITY_ADDRESS_INFORMATION);
        this.debug(`receive IDENTITY_INFORMATION IDENTITY_ADDRESS_INFORMATION`);
        this._ltk = res.ltk;
        this.emit('ltk', this._ltk);
        await this._aclStream.onSmpStkWait(this._ltk);
        const irkBuf = await irkPromise;
        const bdAddrBuf = await bdAddrPromise;
        // we dont have irk, so zero padding
        this.write(Buffer.concat([Buffer.from([smp_1.SMP.IDENTITY_INFORMATION]), Buffer.alloc(16)]));
        this.write(Buffer.concat([
            Buffer.from([smp_1.SMP.IDENTITY_ADDRESS_INFORMATION]),
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
            Buffer.from([smp_1.SMP.PAIRING_RANDOM]),
            (_a = this._r) !== null && _a !== void 0 ? _a : Buffer.alloc(0),
        ]));
    }
    async handlePairingRandomWait(data) {
        const r = data.slice(1);
        let encResult = null;
        const pcnf = Buffer.concat([
            Buffer.from([smp_1.SMP.PAIRING_CONFIRM]),
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
            this.write(Buffer.from([smp_1.SMP.PAIRING_RANDOM, smp_1.SMP.PAIRING_CONFIRM]));
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
        this._aclStream.write(smp_1.SMP.CID, data);
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
                e.cause = new Error('pairing failed when remote device request');
                console.error(e);
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
    hasKeys() {
        if (!this._ltk || !this._rand || !this._ediv) {
            return false;
        }
        return true;
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
                smp_1.SMP.PAIRING_REQUEST,
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
                this.isSecureConnectionMode() ? 0x02 : 0x00,
                this.isSecureConnectionMode() ? 0x02 : 0x01, // Responder key distribution: EncKey   peripheral -> central
            ]);
        }
        else {
            this.debug(`pair No Input and No Output`);
            this._preq = Buffer.from([
                smp_1.SMP.PAIRING_REQUEST,
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
                this.isSecureConnectionMode() ? 0x02 : 0x00,
                this.isSecureConnectionMode() ? 0x02 : 0x01, // Responder key distribution: EncKey
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
            this._aclStream.readWait(smp_1.SMP.CID, flag, timeout),
            this._pairingFailReject(),
        ]);
    }
    _pairingFailReject() {
        return new Promise((resolve, reject) => {
            const cause = new Error('stacktrace');
            this.on('fail', (reason) => {
                reject(new ObnizError_1.ObnizBlePairingRejectByRemoteError(reason, { cause }));
            });
        });
    }
    debug(text) {
        // console.log(new Date(), `SMP: ${text}`);
    }
}
exports.Smp = Smp;
