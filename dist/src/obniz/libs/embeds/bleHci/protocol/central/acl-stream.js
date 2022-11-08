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
exports.AclStream = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const smp_1 = require("./smp");
/**
 *
 * @ignore
 */
class AclStream extends eventemitter3_1.default {
    constructor(hci, handle, localAddressType, localAddress, remoteAddressType, remoteAddress) {
        super();
        this.debugHandler = () => {
            // do nothing.
        };
        this._hci = hci;
        this._handle = handle;
        this._smp = new smp_1.Smp(this, localAddressType, localAddress, remoteAddressType, remoteAddress);
        this._smp.debugHandler = (text) => {
            this.debug(text);
        };
        this.onSmpFailBinded = this.onSmpFail.bind(this);
        this.onSmpEndBinded = this.onSmpEnd.bind(this);
        this._smp.on('fail', this.onSmpFailBinded);
        this._smp.on('end', this.onSmpEndBinded);
    }
    async encryptWait(options) {
        await this._smp.pairingWait(options);
    }
    setEncryptOption(options) {
        this._smp.setPairingOption(options);
    }
    write(cid, data) {
        this._hci.writeAclDataPkt(this._handle, cid, data);
    }
    async readWait(cid, flag, timeout) {
        const data = await this._hci.readAclStreamWait(this._handle, cid, flag, timeout);
        return data;
    }
    push(cid, data) {
        if (data) {
            this.emit('data', cid, data);
        }
        else {
            this.emit('end');
        }
    }
    end() {
        this.emit('end');
    }
    async onSmpStkWait(stk) {
        const random = Buffer.from('0000000000000000', 'hex');
        const diversifier = Buffer.from('0000', 'hex');
        const result = await this._hci.startLeEncryptionWait(this._handle, random, diversifier, stk);
        this.emit('encrypt', result);
        return result;
    }
    async onSmpLtkWait(ltk, random, diversifier) {
        const result = await this._hci.startLeEncryptionWait(this._handle, random, diversifier, ltk);
        this.emit('encrypt', result);
        return result;
    }
    onSmpFail() {
        this.emit('encryptFail');
    }
    onSmpEnd() {
        this._smp.removeListener('fail', this.onSmpFailBinded);
        this._smp.removeListener('end', this.onSmpEndBinded);
    }
    startEncrypt(option) {
        // do nothing.
    }
    debug(text) {
        this.debugHandler(`AclStream: ${text}`);
    }
}
exports.AclStream = AclStream;
