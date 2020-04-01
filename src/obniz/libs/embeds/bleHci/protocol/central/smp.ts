/**
 * @packageDocumentation
 *
 * @ignore
 */

import EventEmitter from "eventemitter3";

const readline = require("readline");
import { networkInterfaces } from "os";
import { BleDeviceAddress, BleDeviceAddressType } from "../../bleTypes";
import AclStream from "./acl-stream";
import crypto from "./crypto";

/**
 * @ignore
 */
namespace SMP {
  export const CID: any = 0x0006;
  export const PAIRING_REQUEST: any = 0x01;
  export const PAIRING_RESPONSE: any = 0x02;
  export const PAIRING_CONFIRM: any = 0x03;
  export const PAIRING_RANDOM: any = 0x04;
  export const PAIRING_FAILED: any = 0x05;
  export const ENCRYPT_INFO: any = 0x06;
  export const MASTER_IDENT: any = 0x07;
  export const SMP_SECURITY_REQUEST: any = 0x0b;
}

type SmpEventTypes = "masterIdent" | "ltk" | "fail" | "stk" | "end";

/**
 * @ignore
 */
class Smp extends EventEmitter<SmpEventTypes> {
  public _aclStream: AclStream;
  public _iat: any;
  public _ia: any;
  public _rat: any;
  public _ra: any;
  public onAclStreamDataBinded: any;
  public onAclStreamEndBinded: any;
  public _preq: any;
  public _pres: any;
  public _tk: any;
  public _r: any;
  public _pcnf: any;
  public _stk: any = null;
  private _options: any = null;

  constructor(
    aclStream: AclStream,
    localAddressType: BleDeviceAddressType,
    localAddress: BleDeviceAddress,
    remoteAddressType: BleDeviceAddressType,
    remoteAddress: BleDeviceAddress,
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

  public sendPairingRequest(options?: any) {
    this._options = options;

    if (this.isPasskeyMode()) {
      this._preq = Buffer.from([
        SMP.PAIRING_REQUEST,
        0x02, // IO capability: Keyboard
        0x00, // OOB data: Authentication data not present
        0x05, // Authentication requirement: Bonding - MITM
        0x10, // Max encryption key size
        0x00, // Initiator key distribution: <none>
        0x01, // Responder key distribution: EncKey
      ]);
    } else {
      this._preq = Buffer.from([
        SMP.PAIRING_REQUEST,
        0x03, // IO capability: NoInputNoOutput
        0x00, // OOB data: Authentication data not present
        0x01, // Authentication requirement: Bonding - No MITM
        0x10, // Max encryption key size
        0x00, // Initiator key distribution: <none>
        0x01, // Responder key distribution: EncKey
      ]);
    }

    this.write(this._preq);
  }

  public onAclStreamData(cid: any, data?: any) {
    if (cid !== SMP.CID) {
      return;
    }

    const code: any = data.readUInt8(0);

    console.warn("pairing " + code);
    if (SMP.PAIRING_RESPONSE === code) {
      this.handlePairingResponse(data);
    } else if (SMP.PAIRING_CONFIRM === code) {
      this.handlePairingConfirm(data);
    } else if (SMP.PAIRING_RANDOM === code) {
      this.handlePairingRandom(data);
    } else if (SMP.PAIRING_FAILED === code) {
      this.handlePairingFailed(data);
    } else if (SMP.ENCRYPT_INFO === code) {
      this.handleEncryptInfo(data);
    } else if (SMP.MASTER_IDENT === code) {
      this.handleMasterIdent(data);
    } else if (SMP.SMP_SECURITY_REQUEST === code) {
      this.handleSecurityRequest(data);
    } else {
      throw new Error();
    }
  }

  public onAclStreamEnd() {
    this._aclStream.removeListener("data", this.onAclStreamDataBinded);
    this._aclStream.removeListener("end", this.onAclStreamEndBinded);

    this.emit("end");
  }

  public async handlePairingResponse(data: any) {
    this._pres = data;

    if (this.isPasskeyMode()) {
      let passkeyNumber = 0;
      try {
        passkeyNumber = await this._options.passkeyCallback();
      } catch {}
      const passkey = new Array(16);
      for (let i = 0; i < 3; i++) {
        passkey[i] = (passkeyNumber >> (i * 8)) & 0xff;
      }

      this._tk = Buffer.from(passkey);
    } else {
      this._tk = Buffer.from("00000000000000000000000000000000", "hex");
    }

    this._r = crypto.r();

    this.write(
      Buffer.concat([
        Buffer.from([SMP.PAIRING_CONFIRM]),
        crypto.c1(this._tk, this._r, this._pres, this._preq, this._iat, this._ia, this._rat, this._ra),
      ]),
    );
  }

  public handlePairingConfirm(data: any) {
    this._pcnf = data;

    this.write(Buffer.concat([Buffer.from([SMP.PAIRING_RANDOM]), this._r]));
  }

  public handlePairingRandom(data: any) {
    const r: any = data.slice(1);

    const pcnf: any = Buffer.concat([
      Buffer.from([SMP.PAIRING_CONFIRM]),
      crypto.c1(this._tk, r, this._pres, this._preq, this._iat, this._ia, this._rat, this._ra),
    ]);

    if (this._pcnf.toString("hex") === pcnf.toString("hex")) {
      if (this._stk !== null) {
        console.error("second stk");
      }
      this._stk = crypto.s1(this._tk, r, this._r);

      this.emit("stk", this._stk);
    } else {
      this.write(Buffer.from([SMP.PAIRING_RANDOM, SMP.PAIRING_CONFIRM]));

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
    this._aclStream.write(SMP.CID, data);
  }

  public handleSecurityRequest(data: any) {
    this.sendPairingRequest();
  }

  private isPasskeyMode() {
    if (this._options && this._options.passkey === true && this._options.passkeyCallback) {
      return true;
    }
    return false;
  }
}

export default Smp;
