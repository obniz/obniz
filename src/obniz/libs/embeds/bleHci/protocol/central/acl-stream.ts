// var debug = require('debug')('acl-att-stream');

const events: any = require("events");

const Smp: any = require("./smp");

class AclStream extends events.EventEmitter {
  public _hci: any;
  public _handle: any;
  public _smp: any;
  public onSmpStkBinded: any;
  public onSmpFailBinded: any;
  public onSmpEndBinded: any;
  public emit: any;

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

    this._smp = new Smp(
      this,
      localAddressType,
      localAddress,
      remoteAddressType,
      remoteAddress,
    );

    this.onSmpStkBinded = this.onSmpStk.bind(this);
    this.onSmpFailBinded = this.onSmpFail.bind(this);
    this.onSmpEndBinded = this.onSmpEnd.bind(this);

    this._smp.on("stk", this.onSmpStkBinded);
    this._smp.on("fail", this.onSmpFailBinded);
    this._smp.on("end", this.onSmpEndBinded);
  }

  public encrypt() {
    this._smp.sendPairingRequest();
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
}

export default AclStream;
