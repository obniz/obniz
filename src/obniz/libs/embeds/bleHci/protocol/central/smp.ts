let events: any = require("events");

let crypto: any = require("./crypto");

let SMP_CID: any = 0x0006;

let SMP_PAIRING_REQUEST: any = 0x01;
let SMP_PAIRING_RESPONSE: any = 0x02;
let SMP_PAIRING_CONFIRM: any = 0x03;
let SMP_PAIRING_RANDOM: any = 0x04;
let SMP_PAIRING_FAILED: any = 0x05;
let SMP_ENCRYPT_INFO: any = 0x06;
let SMP_MASTER_IDENT: any = 0x07;

class Smp extends events.EventEmitter {
  public _aclStream: any;
  public _iat: any;
  public _ia: any;
  public _rat: any;
  public _ra: any;
  public onAclStreamDataBinded: any;
  public onAclStreamEndBinded: any;
  public _preq: any;
  public emit: any;
  public _pres: any;
  public _tk: any;
  public _r: any;
  public _pcnf: any;

  constructor(
    aclStream: any,
    localAddressType: any,
    localAddress: any,
    remoteAddressType: any,
    remoteAddress: any,
  ) {
    super();
    this._aclStream = aclStream;

    this._iat = Buffer.from([localAddressType === "random" ? 0x01 : 0x00]);
    this._ia = Buffer.from(
      localAddress
        .split(":")
        .reverse()
        .join(""),
      "hex",
    );
    this._rat = Buffer.from([remoteAddressType === "random" ? 0x01 : 0x00]);
    this._ra = Buffer.from(
      remoteAddress
        .split(":")
        .reverse()
        .join(""),
      "hex",
    );

    this.onAclStreamDataBinded = this.onAclStreamData.bind(this);
    this.onAclStreamEndBinded = this.onAclStreamEnd.bind(this);

    this._aclStream.on("data", this.onAclStreamDataBinded);
    this._aclStream.on("end", this.onAclStreamEndBinded);
  }

  public sendPairingRequest() {
    this._preq = Buffer.from([
      SMP_PAIRING_REQUEST,
      0x03, // IO capability: NoInputNoOutput
      0x00, // OOB data: Authentication data not present
      0x01, // Authentication requirement: Bonding - No MITM
      0x10, // Max encryption key size
      0x00, // Initiator key distribution: <none>
      0x01, // Responder key distribution: EncKey
    ]);

    this.write(this._preq);
  }

  public onAclStreamData(cid: any, data?: any) {
    if (cid !== SMP_CID) {
      return;
    }

    const code: any = data.readUInt8(0);

    if (SMP_PAIRING_RESPONSE === code) {
      this.handlePairingResponse(data);
    } else if (SMP_PAIRING_CONFIRM === code) {
      this.handlePairingConfirm(data);
    } else if (SMP_PAIRING_RANDOM === code) {
      this.handlePairingRandom(data);
    } else if (SMP_PAIRING_FAILED === code) {
      this.handlePairingFailed(data);
    } else if (SMP_ENCRYPT_INFO === code) {
      this.handleEncryptInfo(data);
    } else if (SMP_MASTER_IDENT === code) {
      this.handleMasterIdent(data);
    }
  }

  public onAclStreamEnd() {
    this._aclStream.removeListener("data", this.onAclStreamDataBinded);
    this._aclStream.removeListener("end", this.onAclStreamEndBinded);

    this.emit("end");
  }

  public handlePairingResponse(data: any) {
    this._pres = data;

    this._tk = Buffer.from("00000000000000000000000000000000", "hex");
    this._r = crypto.r();

    this.write(
      Buffer.concat([
        Buffer.from([SMP_PAIRING_CONFIRM]),
        crypto.c1(
          this._tk,
          this._r,
          this._pres,
          this._preq,
          this._iat,
          this._ia,
          this._rat,
          this._ra,
        ),
      ]),
    );
  }

  public handlePairingConfirm(data: any) {
    this._pcnf = data;

    this.write(Buffer.concat([Buffer.from([SMP_PAIRING_RANDOM]), this._r]));
  }

  public handlePairingRandom(data: any) {
    const r: any = data.slice(1);

    const pcnf: any = Buffer.concat([
      Buffer.from([SMP_PAIRING_CONFIRM]),
      crypto.c1(
        this._tk,
        r,
        this._pres,
        this._preq,
        this._iat,
        this._ia,
        this._rat,
        this._ra,
      ),
    ]);

    if (this._pcnf.toString("hex") === pcnf.toString("hex")) {
      const stk: any = crypto.s1(this._tk, r, this._r);

      this.emit("stk", stk);
    } else {
      this.write(Buffer.from([SMP_PAIRING_RANDOM, SMP_PAIRING_CONFIRM]));

      this.emit("fail");
    }
  }

  public handlePairingFailed(data: any) {
    this.emit("fail");
  }

  public handleEncryptInfo(data: any) {
    const ltk: any = data.slice(1);

    this.emit("ltk", ltk);
  }

  public handleMasterIdent(data: any) {
    const ediv: any = data.slice(1, 3);
    const rand: any = data.slice(3);

    this.emit("masterIdent", ediv, rand);
  }

  public write(data: any) {
    this._aclStream.write(SMP_CID, data);
  }
}

module.exports = Smp;
