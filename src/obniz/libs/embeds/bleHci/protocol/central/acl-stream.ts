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
    this._smp.debugHandler = (text: string) => {
      this.debug(text);
    };

    this.onSmpFailBinded = this.onSmpFail.bind(this);
    this.onSmpEndBinded = this.onSmpEnd.bind(this);

    this._smp.on("fail", this.onSmpFailBinded);
    this._smp.on("end", this.onSmpEndBinded);
  }
  public debugHandler: any = () => {};

  public async encryptWait(options?: any) {
    let encrpytResult = null;
    encrpytResult = await this._smp.pairingWait(options);
    return encrpytResult;
  }

  public setEncryptOption(options?: any) {
    let encrpytResult = null;
    encrpytResult = this._smp.setPairingOption(options);
    return encrpytResult;
  }

  public write(cid: any, data: any) {
    this._hci.writeAclDataPkt(this._handle, cid, data);
  }

  public async readWait(cid: any, flag: number, timeout?: number): Promise<Buffer> {
    const data = await this._hci.readAclStreamWait(this._handle, cid, flag, timeout);
    return data;
  }

  public push(cid: number, data: Buffer) {
    if (data) {
      this.emit("data", cid, data);
    } else {
      this.emit("end");
    }
  }

  public end() {
    this.emit("end");
  }

  public async onSmpStkWait(stk: any) {
    const random: any = Buffer.from("0000000000000000", "hex");
    const diversifier: any = Buffer.from("0000", "hex");

    const result = await this._hci.startLeEncryptionWait(this._handle, random, diversifier, stk);
    this.emit("encrypt", result);
    return result;
  }

  public async onSmpLtkWait(ltk: any, random: Buffer, diversifier: Buffer) {
    const result = await this._hci.startLeEncryptionWait(this._handle, random, diversifier, ltk);
    this.emit("encrypt", result);
    return result;
  }

  public onSmpFail() {
    this.emit("encryptFail");
  }

  public onSmpEnd() {
    this._smp.removeListener("fail", this.onSmpFailBinded);
    this._smp.removeListener("end", this.onSmpEndBinded);
  }

  public startEncrypt(option: any) {}

  private debug(text: any) {
    this.debugHandler(`AclStream: ${text}`);
  }
}
