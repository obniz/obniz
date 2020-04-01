/**
 * @packageDocumentation
 *
 * @ignore
 */
// var debug = require('debug')('acl-att-stream');

import EventEmitter from "eventemitter3";

import { Handle } from "../../bleTypes";
import Hci from "../hci";
import Smp from "./smp";

type AclStreamEventTypes = "data" | "end" | "encrypt" | "encryptFail";

/**
 *
 * @ignore
 */
export default class AclStream extends EventEmitter<AclStreamEventTypes> {
  public _hci: Hci;
  public _handle: Handle;
  public _smp: Smp;
  public onSmpStkBinded: any;
  public onSmpFailBinded: any;
  public onSmpEndBinded: any;

  constructor(
    hci: Hci,
    handle: Handle,
    localAddressType: any,
    localAddress: any,
    remoteAddressType: any,
    remoteAddress: any,
  ) {
    super();
    this._hci = hci;
    this._handle = handle;

    this._smp = new Smp(this, localAddressType, localAddress, remoteAddressType, remoteAddress);

    this.onSmpStkBinded = this.onSmpStk.bind(this);
    this.onSmpFailBinded = this.onSmpFail.bind(this);
    this.onSmpEndBinded = this.onSmpEnd.bind(this);

    this._smp.on("stk", this.onSmpStkBinded);
    this._smp.on("fail", this.onSmpFailBinded);
    this._smp.on("end", this.onSmpEndBinded);
  }

  public encrypt(options?: any) {
    if (options && options.keys && options.keys.stk) {
      console.error("skip pairing");

      this._smp._preq = options.keys.preq;
      this._smp._pres = options.keys.pres;
      this._smp._tk = options.keys.tk;
      this._smp._r = options.keys.r;
      this._smp._pcnf = options.keys.pcnf;

      this.onSmpStk(options.keys.stk);
    } else {
      this._smp.sendPairingRequest(options);
    }
  }

  public write(cid: any, data: any) {
    this._hci.writeAclDataPkt(this._handle, cid, data);
  }

  public push(cid: any, data: any) {
    if (data) {
      this.emit("data", cid, data);
    } else {
      this.emit("end");
    }
  }

  public pushEncrypt(encrypt: any) {
    this.emit("encrypt", encrypt);
  }

  public onSmpStk(stk: any) {
    const random: any = Buffer.from("0000000000000000", "hex");
    const diversifier: any = Buffer.from("0000", "hex");

    this._hci.startLeEncryption(this._handle, random, diversifier, stk);
  }

  public onSmpFail() {
    this.emit("encryptFail");
  }

  public onSmpEnd() {
    this._smp.removeListener("stk", this.onSmpStkBinded);
    this._smp.removeListener("fail", this.onSmpFailBinded);
    this._smp.removeListener("end", this.onSmpEndBinded);
  }

  public startEncrypt(option: any) {}
}
