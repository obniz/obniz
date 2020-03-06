/**
 * @packageDocumentation
 *
 * @ignore
 */
import events from "events";

import Smp from "./smp";

/**
 * @ignore
 */
class AclStream extends events.EventEmitter {
  public _hci: any;
  public _handle: any;
  public encypted: any;
  public _smp: any;
  public encrypted: any;

  constructor(
    hci: any,
    handle: any,
    localAddressType: any,
    localAddress: any,
    remoteAddressType: any,
    remoteAddress: any,
  ) {
    super();
    this._hci = hci;
    this._handle = handle;
    this.encypted = false;

    this._smp = new Smp(this, localAddressType, localAddress, remoteAddressType, remoteAddress, this._hci);
  }

  public write(cid: any, data: any) {
    this._hci.queueAclDataPkt(this._handle, cid, data);
  }

  public push(cid: any, data: any) {
    if (data) {
      this.emit("data", cid, data);
    } else {
      this.emit("end");
    }
  }

  public pushEncrypt(encrypt: any) {
    this.encrypted = encrypt ? true : false;

    this.emit("encryptChange", this.encrypted);
  }

  public pushLtkNegReply() {
    this.emit("ltkNegReply");
  }
}

export default AclStream;
