// var debug = require('debug')('bindings');
const debug: any = () => {
};

import events from "events";
import os from "os";
import AclStream from "./acl-stream";
import Gap from "./gap";
import Gatt from "./gatt";

class BlenoBindings extends events.EventEmitter {
  public _state: any;
  public _advertising: any;
  public _hci: any;
  public _gap: any;
  public _gatt: any;
  public _address: any;
  public _handle: any;
  private _aclStream: AclStream | null;

  constructor(hciProtocol: any) {
    super();
    this._state = null;

    this._advertising = false;

    this._hci = hciProtocol;
    this._gap = new Gap(this._hci);
    this._gatt = new Gatt();

    this._address = null;
    this._handle = null;
    this._aclStream = null;
  }

  public startAdvertising(name: any, serviceUuids: any) {
    this._advertising = true;

    this._gap.startAdvertising(name, serviceUuids);
  }

  public startAdvertisingIBeacon(data: any) {
    this._advertising = true;

    this._gap.startAdvertisingIBeacon(data);
  }

  public startAdvertisingWithEIRData(advertisementData: any, scanData: any) {
    this._advertising = true;

    this._gap.startAdvertisingWithEIRData(advertisementData, scanData);
  }

  public stopAdvertising() {
    this._advertising = false;

    this._gap.stopAdvertising();
  }

  public setServices(services: any) {
    this._gatt.setServices(services);

    this.emit("servicesSet");
  }

  public disconnect() {
    if (this._handle) {
      debug("disconnect by server");

      this._hci.disconnect(this._handle);
    }
  }

  public updateRssi() {
    if (this._handle) {
      this._hci.readRssi(this._handle);
    }
  }

  public init() {
    this._gap.on("advertisingStart", this.onAdvertisingStart.bind(this));
    this._gap.on("advertisingStop", this.onAdvertisingStop.bind(this));

    this._gatt.on("mtuChange", this.onMtuChange.bind(this));

    this._hci.on("stateChange", this.onStateChange.bind(this));
    this._hci.on("addressChange", this.onAddressChange.bind(this));
    this._hci.on("readLocalVersion", this.onReadLocalVersion.bind(this));

    this._hci.on("leConnComplete", this.onLeConnComplete.bind(this));
    this._hci.on(
      "leConnUpdateComplete",
      this.onLeConnUpdateComplete.bind(this),
    );
    this._hci.on("rssiRead", this.onRssiRead.bind(this));
    this._hci.on("disconnComplete", this.onDisconnComplete.bind(this));
    this._hci.on("encryptChange", this.onEncryptChange.bind(this));
    this._hci.on("leLtkNegReply", this.onLeLtkNegReply.bind(this));
    this._hci.on("aclDataPkt", this.onAclDataPkt.bind(this));

    this.emit("platform", os.platform());
  }

  public onStateChange(state: any) {
    if (this._state === state) {
      return;
    }
    this._state = state;

    if (state === "unauthorized") {
      console.log(
        "bleno warning: adapter state unauthorized, please run as root or with sudo",
      );
      console.log(
        "               or see README for information on running without root/sudo:",
      );
      console.log(
        "               https://github.com/sandeepmistry/bleno#running-on-linux",
      );
    } else if (state === "unsupported") {
      console.log(
        "bleno warning: adapter does not support Bluetooth Low Energy (BLE, Bluetooth Smart).",
      );
      console.log("               Try to run with environment variable:");
      console.log("               [sudo] BLENO_HCI_DEVICE_ID=x node ...");
    }

    this.emit("stateChange", state);
  }

  public onAddressChange(address: any) {
    this.emit("addressChange", address);
  }

  public onReadLocalVersion(hciVer: any, hciRev?: any, lmpVer?: any, manufacturer?: any, lmpSubVer?: any) {
  }

  public onAdvertisingStart(error: any) {
    this.emit("advertisingStart", error);
  }

  public onAdvertisingStop() {
    this.emit("advertisingStop");
  }

  public onLeConnComplete(
    status: any,
    handle?: any,
    role?: any,
    addressType?: any,
    address?: any,
    interval?: any,
    latency?: any,
    supervisionTimeout?: any,
    masterClockAccuracy?: any,
  ) {
    if (role !== 1) {
      // not slave, ignore
      return;
    }

    this._address = address;
    this._handle = handle;
    this._aclStream = new AclStream(
      this._hci,
      handle,
      this._hci.addressType,
      this._hci.address,
      addressType,
      address,
    );
    this._gatt.setAclStream(this._aclStream);

    this.emit("accept", address);
  }

  public onLeConnUpdateComplete(handle: any, interval?: any, latency?: any, supervisionTimeout?: any) {
    // no-op
  }

  public onDisconnComplete(handle: any, reason?: any) {
    if (this._handle !== handle) {
      return; // not peripheral
    }
    if (this._aclStream) {
      this._aclStream.push(null, null);
    }

    const address: any = this._address;

    this._address = null;
    this._handle = null;
    this._aclStream = null;

    if (address) {
      this.emit("disconnect", address); // TODO: use reason
    }

    if (this._advertising) {
      this._gap.restartAdvertising();
    }
  }

  public onEncryptChange(handle: any, encrypt?: any) {
    if (this._handle === handle && this._aclStream) {
      this._aclStream.pushEncrypt(encrypt);
    }
  }

  public onLeLtkNegReply(handle: any) {
    if (this._handle === handle && this._aclStream) {
      this._aclStream.pushLtkNegReply();
    }
  }

  public onMtuChange(mtu: any) {
    this.emit("mtuChange", mtu);
  }

  public onRssiRead(handle: any, rssi?: any) {
    this.emit("rssiUpdate", rssi);
  }

  public onAclDataPkt(handle: any, cid?: any, data?: any) {
    if (this._handle === handle && this._aclStream) {
      this._aclStream.push(cid, data);
    }
  }
}

export default BlenoBindings;
