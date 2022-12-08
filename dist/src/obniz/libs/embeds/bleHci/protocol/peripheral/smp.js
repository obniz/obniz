"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Smp = void 0;
/**
 * @packageDocumentation
 *
 * @ignore
 */
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const bleHelper_1 = __importDefault(require("../../bleHelper"));
const crypto_1 = __importDefault(require("../common/crypto"));
const mgmt_1 = require("./mgmt");
const smp_1 = require("../common/smp");
/**
 * @ignore
 */
class Smp extends eventemitter3_1.default {
    constructor(aclStream, localAddressType, localAddress, remoteAddressType, remoteAddress, hciProtocol) {
        super();
        this._aclStream = aclStream;
        this._mgmt = new mgmt_1.Mgmt(hciProtocol);
        this._iat = Buffer.from([remoteAddressType === 'random' ? 0x01 : 0x00]);
        this._ia = bleHelper_1.default.hex2reversedBuffer(remoteAddress, ':');
        this._rat = Buffer.from([localAddressType === 'random' ? 0x01 : 0x00]);
        this._ra = bleHelper_1.default.hex2reversedBuffer(localAddress, ':');
        this._stk = null;
        this._random = null;
        this._diversifier = null;
        this.onAclStreamDataBinded = this.onAclStreamData.bind(this);
        this.onAclStreamEncryptChangeBinded = this.onAclStreamEncryptChange.bind(this);
        this.onAclStreamLtkNegReplyBinded = this.onAclStreamLtkNegReply.bind(this);
        this.onAclStreamEndBinded = this.onAclStreamEnd.bind(this);
        this._aclStream.on('data', this.onAclStreamDataBinded);
        this._aclStream.on('encryptChange', this.onAclStreamEncryptChangeBinded);
        this._aclStream.on('ltkNegReply', this.onAclStreamLtkNegReplyBinded);
        this._aclStream.on('end', this.onAclStreamEndBinded);
    }
    onAclStreamData(cid, data) {
        if (cid !== smp_1.SMP.CID) {
            return;
        }
        const code = data.readUInt8(0);
        if (smp_1.SMP.PAIRING_REQUEST === code) {
            this.handlePairingRequest(data);
        }
        else if (smp_1.SMP.PAIRING_CONFIRM === code) {
            this.handlePairingConfirm(data);
        }
        else if (smp_1.SMP.PAIRING_RANDOM === code) {
            this.handlePairingRandom(data);
        }
        else if (smp_1.SMP.PAIRING_FAILED === code) {
            this.handlePairingFailed(data);
        }
    }
    onAclStreamEncryptChange(encrypted) {
        if (encrypted) {
            if (this._stk && this._diversifier && this._random) {
                this.write(Buffer.concat([Buffer.from([smp_1.SMP.ENCRYPT_INFO]), this._stk]));
                this.write(Buffer.concat([
                    Buffer.from([smp_1.SMP.MASTER_IDENT]),
                    this._diversifier,
                    this._random,
                ]));
            }
        }
    }
    onAclStreamLtkNegReply() {
        this.write(Buffer.from([smp_1.SMP.PAIRING_FAILED, smp_1.SMP.UNSPECIFIED]));
        this.emit('fail');
    }
    onAclStreamEnd() {
        this._aclStream.removeListener('data', this.onAclStreamDataBinded);
        this._aclStream.removeListener('encryptChange', this.onAclStreamEncryptChangeBinded);
        this._aclStream.removeListener('ltkNegReply', this.onAclStreamLtkNegReplyBinded);
        this._aclStream.removeListener('end', this.onAclStreamEndBinded);
    }
    handlePairingRequest(data) {
        this._preq = data;
        this._pres = Buffer.from([
            smp_1.SMP.PAIRING_RESPONSE,
            0x03,
            0x00,
            0x01,
            0x10,
            0x00,
            0x01, // Responder key distribution: EncKey
        ]);
        this.write(this._pres);
    }
    handlePairingConfirm(data) {
        this._pcnf = data;
        this._tk = Buffer.from('00000000000000000000000000000000', 'hex');
        this._r = crypto_1.default.r();
        this.write(Buffer.concat([
            Buffer.from([smp_1.SMP.PAIRING_CONFIRM]),
            crypto_1.default.c1(this._tk, this._r, this._pres, this._preq, this._iat, this._ia, this._rat, this._ra),
        ]));
    }
    handlePairingRandom(data) {
        const r = data.slice(1);
        const pcnf = Buffer.concat([
            Buffer.from([smp_1.SMP.PAIRING_CONFIRM]),
            crypto_1.default.c1(this._tk, r, this._pres, this._preq, this._iat, this._ia, this._rat, this._ra),
        ]);
        if (this._pcnf.toString('hex') === pcnf.toString('hex')) {
            this._diversifier = Buffer.from('0000', 'hex');
            this._random = Buffer.from('0000000000000000', 'hex');
            this._stk = crypto_1.default.s1(this._tk, this._r, r);
            this._mgmt.addLongTermKey(this._ia, this._iat, 0, 0, this._diversifier, this._random, this._stk);
            this.write(Buffer.concat([Buffer.from([smp_1.SMP.PAIRING_RANDOM]), this._r]));
        }
        else {
            this.write(Buffer.from([smp_1.SMP.PAIRING_FAILED, smp_1.SMP.PAIRING_CONFIRM]));
            this.emit('fail');
        }
    }
    handlePairingFailed(data) {
        this.emit('fail');
    }
    write(data) {
        this._aclStream.write(smp_1.SMP.CID, data);
    }
}
exports.Smp = Smp;
