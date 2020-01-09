let events: any = require("events");

let Smp: any = require("./smp");

class AclStream extends events.EventEmitter {
  public _hci: any;
  public _handle: any;
  public encypted: any;
  public _smp: any;
  public emit: any;
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

    this._smp = new Smp(
      this,
      localAddressType,
      localAddress,
      remoteAddressType,
      remoteAddress,
      this._hci,
    );
  }

  public rite(cid: any, data: any) {
    this._hci.queueAclDataPkt(this._handle, cid, data);
  }

  public ush(cid: any, data: any) {
    if (data) {
      this.emit("data", cid, data);
    } else {
      this.emit("end");
    }
  }

  public ushEncrypt(encrypt: any) {
    this.encrypted = encrypt ? true : false;

    this.emit("encryptChange", this.encrypted);
  }

  public ushLtkNegReply() {
    this.emit("ltkNegReply");
  }
}

module.exports = AclStream;
