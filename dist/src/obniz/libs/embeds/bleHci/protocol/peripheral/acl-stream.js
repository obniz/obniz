"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __importDefault(require("events"));
const smp_1 = __importDefault(require("./smp"));
class AclStream extends events_1.default.EventEmitter {
    constructor(hci, handle, localAddressType, localAddress, remoteAddressType, remoteAddress) {
        super();
        this._hci = hci;
        this._handle = handle;
        this.encypted = false;
        this._smp = new smp_1.default(this, localAddressType, localAddress, remoteAddressType, remoteAddress, this._hci);
    }
    write(cid, data) {
        this._hci.queueAclDataPkt(this._handle, cid, data);
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
        this.encrypted = encrypt ? true : false;
        this.emit("encryptChange", this.encrypted);
    }
    pushLtkNegReply() {
        this.emit("ltkNegReply");
    }
}
exports.default = AclStream;

//# sourceMappingURL=acl-stream.js.map
