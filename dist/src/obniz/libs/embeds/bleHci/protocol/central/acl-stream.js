"use strict";
/**
 * @packageDocumentation
 *
 * @ignore
 */
// var debug = require('debug')('acl-att-stream');
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const smp_1 = __importDefault(require("./smp"));
/**
 *
 * @ignore
 */
class AclStream extends eventemitter3_1.default {
    constructor(hci, handle, localAddressType, localAddress, remoteAddressType, remoteAddress) {
        super();
        this._hci = hci;
        this._handle = handle;
        this._smp = new smp_1.default(this, localAddressType, localAddress, remoteAddressType, remoteAddress);
        this.onSmpStkBinded = this.onSmpStk.bind(this);
        this.onSmpFailBinded = this.onSmpFail.bind(this);
        this.onSmpEndBinded = this.onSmpEnd.bind(this);
        this._smp.on("stk", this.onSmpStkBinded);
        this._smp.on("fail", this.onSmpFailBinded);
        this._smp.on("end", this.onSmpEndBinded);
    }
    encrypt(keys) {
        if (keys && keys.stk) {
            console.error("skip pairing");
            this._smp._preq = keys.preq;
            this._smp._pres = keys.pres;
            this._smp._tk = keys.tk;
            this._smp._r = keys.r;
            this._smp._pcnf = keys.pcnf;
            this.onSmpStk(keys.stk);
        }
        else {
            this._smp.sendPairingRequest();
        }
    }
    write(cid, data) {
        this._hci.writeAclDataPkt(this._handle, cid, data);
    }
    push(cid, data) {
        if (data) {
            this.emit("data", cid, data);
        }
        else {
            this.emit("end");
        }
    }
    pushEncrypt(encrypt) {
        this.emit("encrypt", encrypt);
    }
    onSmpStk(stk) {
        const random = Buffer.from("0000000000000000", "hex");
        const diversifier = Buffer.from("0000", "hex");
        this._hci.startLeEncryption(this._handle, random, diversifier, stk);
    }
    onSmpFail() {
        this.emit("encryptFail");
    }
    onSmpEnd() {
        this._smp.removeListener("stk", this.onSmpStkBinded);
        this._smp.removeListener("fail", this.onSmpFailBinded);
        this._smp.removeListener("end", this.onSmpEndBinded);
    }
}
exports.default = AclStream;

//# sourceMappingURL=acl-stream.js.map
