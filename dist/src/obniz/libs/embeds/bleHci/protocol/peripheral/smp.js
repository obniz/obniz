"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 *
 * @ignore
 */
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const crypto_1 = __importDefault(require("./crypto"));
const mgmt_1 = __importDefault(require("./mgmt"));
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
    SMP.UNSPECIFIED = 0x08;
})(SMP || (SMP = {}));
/**
 * @ignore
 */
class Smp extends eventemitter3_1.default {
    constructor(aclStream, localAddressType, localAddress, remoteAddressType, remoteAddress, hciProtocol) {
        super();
        this._aclStream = aclStream;
        this._mgmt = new mgmt_1.default(hciProtocol);
        this._iat = Buffer.from([remoteAddressType === "random" ? 0x01 : 0x00]);
        this._ia = Buffer.from(remoteAddress
            .split(":")
            .reverse()
            .join(""), "hex");
        this._rat = Buffer.from([localAddressType === "random" ? 0x01 : 0x00]);
        this._ra = Buffer.from(localAddress
            .split(":")
            .reverse()
            .join(""), "hex");
        this._stk = null;
        this._random = null;
        this._diversifier = null;
        this.onAclStreamDataBinded = this.onAclStreamData.bind(this);
        this.onAclStreamEncryptChangeBinded = this.onAclStreamEncryptChange.bind(this);
        this.onAclStreamLtkNegReplyBinded = this.onAclStreamLtkNegReply.bind(this);
        this.onAclStreamEndBinded = this.onAclStreamEnd.bind(this);
        this._aclStream.on("data", this.onAclStreamDataBinded);
        this._aclStream.on("encryptChange", this.onAclStreamEncryptChangeBinded);
        this._aclStream.on("ltkNegReply", this.onAclStreamLtkNegReplyBinded);
        this._aclStream.on("end", this.onAclStreamEndBinded);
    }
    onAclStreamData(cid, data) {
        if (cid !== SMP.CID) {
            return;
        }
        const code = data.readUInt8(0);
        if (SMP.PAIRING_REQUEST === code) {
            this.handlePairingRequest(data);
        }
        else if (SMP.PAIRING_CONFIRM === code) {
            this.handlePairingConfirm(data);
        }
        else if (SMP.PAIRING_RANDOM === code) {
            this.handlePairingRandom(data);
        }
        else if (SMP.PAIRING_FAILED === code) {
            this.handlePairingFailed(data);
        }
    }
    onAclStreamEncryptChange(encrypted) {
        if (encrypted) {
            if (this._stk && this._diversifier && this._random) {
                this.write(Buffer.concat([Buffer.from([SMP.ENCRYPT_INFO]), this._stk]));
                this.write(Buffer.concat([Buffer.from([SMP.MASTER_IDENT]), this._diversifier, this._random]));
            }
        }
    }
    onAclStreamLtkNegReply() {
        this.write(Buffer.from([SMP.PAIRING_FAILED, SMP.UNSPECIFIED]));
        this.emit("fail");
    }
    onAclStreamEnd() {
        this._aclStream.removeListener("data", this.onAclStreamDataBinded);
        this._aclStream.removeListener("encryptChange", this.onAclStreamEncryptChangeBinded);
        this._aclStream.removeListener("ltkNegReply", this.onAclStreamLtkNegReplyBinded);
        this._aclStream.removeListener("end", this.onAclStreamEndBinded);
    }
    handlePairingRequest(data) {
        this._preq = data;
        this._pres = Buffer.from([
            SMP.PAIRING_RESPONSE,
            0x03,
            0x00,
            0x01,
            0x10,
            0x00,
            0x01,
        ]);
        this.write(this._pres);
    }
    handlePairingConfirm(data) {
        this._pcnf = data;
        this._tk = Buffer.from("00000000000000000000000000000000", "hex");
        this._r = crypto_1.default.r();
        this.write(Buffer.concat([
            Buffer.from([SMP.PAIRING_CONFIRM]),
            crypto_1.default.c1(this._tk, this._r, this._pres, this._preq, this._iat, this._ia, this._rat, this._ra),
        ]));
    }
    handlePairingRandom(data) {
        const r = data.slice(1);
        const pcnf = Buffer.concat([
            Buffer.from([SMP.PAIRING_CONFIRM]),
            crypto_1.default.c1(this._tk, r, this._pres, this._preq, this._iat, this._ia, this._rat, this._ra),
        ]);
        if (this._pcnf.toString("hex") === pcnf.toString("hex")) {
            this._diversifier = Buffer.from("0000", "hex");
            this._random = Buffer.from("0000000000000000", "hex");
            this._stk = crypto_1.default.s1(this._tk, this._r, r);
            this._mgmt.addLongTermKey(this._ia, this._iat, 0, 0, this._diversifier, this._random, this._stk);
            this.write(Buffer.concat([Buffer.from([SMP.PAIRING_RANDOM]), this._r]));
        }
        else {
            this.write(Buffer.from([SMP.PAIRING_FAILED, SMP.PAIRING_CONFIRM]));
            this.emit("fail");
        }
    }
    handlePairingFailed(data) {
        this.emit("fail");
    }
    write(data) {
        this._aclStream.write(SMP.CID, data);
    }
}
exports.default = Smp;
