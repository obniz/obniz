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
const crypto_1 = __importDefault(require("./crypto"));
/**
 * @ignore
 */
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
    SMP.SMP_SECURITY_REQUEST = 0x0b;
})(SMP || (SMP = {}));
/**
 * @ignore
 */
class Smp extends eventemitter3_1.default {
    constructor(aclStream, localAddressType, localAddress, remoteAddressType, remoteAddress) {
        super();
        this._stk = null;
        this._ltk = null;
        this._options = undefined;
        this.debugHandler = () => { };
        this._aclStream = aclStream;
        this._iat = Buffer.from([localAddressType === "random" ? 0x01 : 0x00]);
        this._ia = Buffer.from(localAddress
            .split(":")
            .reverse()
            .join(""), "hex");
        this._rat = Buffer.from([remoteAddressType === "random" ? 0x01 : 0x00]);
        this._ra = Buffer.from(remoteAddress
            .split(":")
            .reverse()
            .join(""), "hex");
        this.onAclStreamDataBinded = this.onAclStreamData.bind(this);
        this.onAclStreamEndBinded = this.onAclStreamEnd.bind(this);
        this._aclStream.on("data", this.onAclStreamDataBinded);
        this._aclStream.on("end", this.onAclStreamEndBinded);
    }
    async pairingWithKeyWait(key) {
        this.debug(`Pairing using keys ${key}`);
        this.setKeys(key);
        const encResult = await this._aclStream.onSmpLtkWait(this._ltk, this._rand, this._ediv);
        return encResult;
    }
    setPairingOption(options) {
        this._options = options;
    }
    async pairingWait(options) {
        this._options = Object.assign(Object.assign({}, this._options), options);
        if (this._options && this._options.keys) {
            return await this.pairingWithKeyWait(this._options.keys);
        }
        this.debug(`Going to Pairing`);
        await this.sendPairingRequestWait();
        this.debug(`Waiting Pairing Response`);
        const pairingResponse = await this._readWait(SMP.PAIRING_RESPONSE);
        await this.handlePairingResponse(pairingResponse);
        this.debug(`Waiting Pairing Confirm`);
        const confirm = await this._readWait(SMP.PAIRING_CONFIRM, 60 * 1000); // 60sec timeout
        this.handlePairingConfirm(confirm);
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
        if (this._options && this._options.onPairedCallback) {
            this._options.onPairedCallback(this.getKeys());
        }
        return encResult;
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
        this._aclStream.removeListener("data", this.onAclStreamDataBinded);
        this._aclStream.removeListener("end", this.onAclStreamEndBinded);
        this.emit("end");
    }
    async handlePairingResponse(data) {
        this._pres = data;
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
            this._tk = Buffer.from("00000000000000000000000000000000", "hex");
        }
        this._r = crypto_1.default.r();
        this.write(Buffer.concat([
            Buffer.from([SMP.PAIRING_CONFIRM]),
            crypto_1.default.c1(this._tk, this._r, this._pres, this._preq, this._iat, this._ia, this._rat, this._ra),
        ]));
    }
    handlePairingConfirm(data) {
        this._pcnf = data;
        this.write(Buffer.concat([Buffer.from([SMP.PAIRING_RANDOM]), this._r]));
    }
    async handlePairingRandomWait(data) {
        const r = data.slice(1);
        let encResult = null;
        const pcnf = Buffer.concat([
            Buffer.from([SMP.PAIRING_CONFIRM]),
            crypto_1.default.c1(this._tk, r, this._pres, this._preq, this._iat, this._ia, this._rat, this._ra),
        ]);
        if (this._pcnf.toString("hex") === pcnf.toString("hex")) {
            if (this._stk !== null) {
                console.error("second stk");
            }
            this._stk = crypto_1.default.s1(this._tk, r, this._r);
            // this.emit("stk", this._stk);
            encResult = await this._aclStream.onSmpStkWait(this._stk);
        }
        else {
            this.write(Buffer.from([SMP.PAIRING_RANDOM, SMP.PAIRING_CONFIRM]));
            this.emit("fail", 0);
            throw new Error("Encryption pcnf error");
        }
        return encResult;
    }
    handlePairingFailed(data) {
        this.emit("fail", data.readUInt8(1));
    }
    handleEncryptInfo(data) {
        this._ltk = data.slice(1);
        this.emit("ltk", this._ltk);
    }
    handleMasterIdent(data) {
        const ediv = data.slice(1, 3);
        const rand = data.slice(3);
        this._ediv = ediv;
        this._rand = rand;
        this.emit("masterIdent", ediv, rand);
    }
    write(data) {
        this._aclStream.write(SMP.CID, data);
    }
    handleSecurityRequest(data) {
        this.pairingWait()
            .then(() => { })
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
        const keyString = Buffer.from(keyStringBase64, "base64").toString("ascii");
        this.debug(`restored keys ${keyString}`);
        const keys = JSON.parse(keyString);
        this._stk = Buffer.from(keys.stk, "hex");
        this._preq = Buffer.from(keys.preq, "hex");
        this._pres = Buffer.from(keys.pres, "hex");
        this._tk = Buffer.from(keys.tk, "hex");
        this._r = Buffer.from(keys.r, "hex");
        this._pcnf = Buffer.from(keys.pcnf, "hex");
        this._ltk = Buffer.from(keys.ltk, "hex");
        this._ediv = Buffer.from(keys.ediv, "hex");
        this._rand = Buffer.from(keys.rand, "hex");
    }
    getKeys() {
        const keys = {
            stk: this._stk.toString("hex"),
            preq: this._preq.toString("hex"),
            pres: this._pres.toString("hex"),
            tk: this._tk.toString("hex"),
            r: this._r.toString("hex"),
            pcnf: this._pcnf.toString("hex"),
            ltk: this._ltk.toString("hex"),
            ediv: this._ediv.toString("hex"),
            rand: this._rand.toString("hex"),
        };
        const jsonString = JSON.stringify(keys);
        const keyString = Buffer.from(jsonString, "ascii").toString("base64");
        return keyString;
    }
    async sendPairingRequestWait() {
        if (this.isPasskeyMode()) {
            this.debug(`pair capable passkey`);
            this._preq = Buffer.from([
                SMP.PAIRING_REQUEST,
                0x02,
                0x00,
                0x05,
                0x10,
                0x00,
                0x01,
            ]);
        }
        else {
            this.debug(`pair No Input and No Output`);
            this._preq = Buffer.from([
                SMP.PAIRING_REQUEST,
                0x03,
                0x00,
                0x01,
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
    _readWait(flag, timeout) {
        return Promise.race([this._aclStream.readWait(SMP.CID, flag, timeout), this._pairingFailReject()]);
    }
    _pairingFailReject() {
        return new Promise((resolve, reject) => {
            this.on("fail", (reason) => {
                reject(new ObnizError_1.ObnizBlePairingRejectByRemoteError(reason));
            });
        });
    }
    debug(text) {
        this.debugHandler(`SMP: ${text}`);
    }
}
exports.default = Smp;
