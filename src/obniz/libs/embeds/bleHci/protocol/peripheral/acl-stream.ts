/**
 * @packageDocumentation
 *
 * @ignore
 */
import EventEmitter from "eventemitter3";

import Hci from "../hci";
import Smp from "./smp";

type AclStreamEventTypes = "data" | "end" | "encryptChange";
/**
 * @ignore
 */
class AclStream extends EventEmitter<AclStreamEventTypes> {
  public _hci: Hci;
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

  public write(cid: number, data: Buffer) {
    this._hci.queueAclDataPkt(this._handle, cid, data);
  }

  public push(cid: number, data: Buffer) {
    if (data) {
      this.emit("data", cid, data);
    }
  }
  public end() {
    this.emit("end");
  }

  public pushEncrypt(encrypt: any) {
    this.encrypted = encrypt ? true : false;

    this.emit("encryptChange", this.encrypted);
  }
}

export default AclStream;
