"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AclStream = void 0;
/**
 * @packageDocumentation
 *
 * @ignore
 */
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const smp_1 = require("./smp");
/**
 * @ignore
 */
class AclStream extends eventemitter3_1.default {
    constructor(hci, handle, localAddressType, localAddress, remoteAddressType, remoteAddress) {
        super();
        this._hci = hci;
        this._handle = handle;
        this.encypted = false;
        this._smp = new smp_1.Smp(this, localAddressType, localAddress, remoteAddressType, remoteAddress, this._hci);
    }
    write(cid, data) {
        this._hci.queueAclDataPkt(this._handle, cid, data);
    }
    push(cid, data) {
        if (data) {
            this.emit('data', cid, data);
        }
    }
    end() {
        this.emit('end');
    }
    pushEncrypt(encrypt) {
        this.encrypted = encrypt ? true : false;
        this.emit('encryptChange', this.encrypted);
    }
}
exports.AclStream = AclStream;
