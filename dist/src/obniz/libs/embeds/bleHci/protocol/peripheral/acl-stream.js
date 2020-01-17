"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events = require("events");
const Smp = require("./smp");
class AclStream extends events.EventEmitter {
    constructor(hci, handle, localAddressType, localAddress, remoteAddressType, remoteAddress) {
        super();
        this._hci = hci;
        this._handle = handle;
        this.encypted = false;
        this._smp = new Smp(this, localAddressType, localAddress, remoteAddressType, remoteAddress, this._hci);
    }
    rite(cid, data) {
        this._hci.queueAclDataPkt(this._handle, cid, data);
    }
    ush(cid, data) {
        if (data) {
            this.emit("data", cid, data);
        }
        else {
            this.emit("end");
        }
    }
    ushEncrypt(encrypt) {
        this.encrypted = encrypt ? true : false;
        this.emit("encryptChange", this.encrypted);
    }
    ushLtkNegReply() {
        this.emit("ltkNegReply");
    }
}
exports.default = AclStream;

//# sourceMappingURL=acl-stream.js.map
