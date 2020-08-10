/**
 * @packageDocumentation
 *
 * @ignore
 */
// var debug = require('debug')('bindings');

import Hci from "../hci";

/**
 * @ignore
 */
const debug: any = () => {};
import EventEmitter from "eventemitter3";
import os from "os";
import { Handle } from "../../bleTypes";
import AclStream from "./acl-stream";
import Gap from "./gap";
import Gatt from "./gatt";

type BlenoBindingsEventType = "stateChange" | "mtuChange" | "accept" | "disconnect";

/**
 * @ignore
 */
class BlenoBindings extends EventEmitter<BlenoBindingsEventType> {
  public _state: any;
  public _advertising: any;
  public _hci: Hci;
  public _gap: Gap;
  public _gatt: Gatt;
  public _address: any;
  public _handle: Handle | null;
  private _aclStream: AclStream | null;

  constructor(hciProtocol: any) {
    super();
    this._state = null;

    this._advertising = false;

    this._hci = hciProtocol;
    this._gap = new Gap(this._hci);
    this._gatt = new Gatt();

    this._gatt.on("mtuChange", this.onMtuChange.bind(this));

    this._hci.on("stateChange", this.onStateChange.bind(this));
    this._hci.on("leConnComplete", this.onLeConnComplete.bind(this));
    this._hci.on("leConnUpdateComplete", this.onLeConnUpdateComplete.bind(this));

    this._hci.on("disconnComplete", this.onDisconnCompleteWait.bind(this));
    this._hci.on("encryptChange", this.onEncryptChange.bind(this));
    this._hci.on("aclDataPkt", this.onAclDataPkt.bind(this));

    this._address = null;
    this._handle = null;
    this._aclStream = null;
  }

  /**
   * @ignore
   * @private
   */
  public _reset() {
    this._state = null;

    this._advertising = false;

    this._gap._reset();
    this._gatt._reset();

    this._address = null;
    this._handle = null;
    this._aclStream = null;
  }

  public async startAdvertisingWait(name: any, serviceUuids: any) {
    this._advertising = true;

    await this._gap.startAdvertisingWait(name, serviceUuids);
  }

  public async startAdvertisingIBeaconWait(data: any) {
    this._advertising = true;

    await this._gap.startAdvertisingIBeaconWait(data);
  }

  public async startAdvertisingWithEIRDataWait(advertisementData: any, scanData: any) {
    this._advertising = true;

    await this._gap.startAdvertisingWithEIRDataWait(advertisementData, scanData);
  }

  public async stopAdvertisingWait() {
    this._advertising = false;

    await this._gap.stopAdvertisingWait();
  }

  public setServices(services: any) {
    this._gatt.setServices(services);
  }

  public disconnect() {
    if (this._handle) {
      debug("disconnect by server");

      this._hci.disconnect(this._handle);
    }
  }

  public async updateRssiWait(): Promise<number | null> {
    if (this._handle) {
      const rssi = await this._hci.readRssiWait(this._handle);
      return rssi;
    }
    return null;
  }

  public onStateChange(state: any) {
    if (this._state === state) {
      return;
    }
    this._state = state;

    if (state === "unauthorized") {
      console.log("bleno warning: adapter state unauthorized, please run as root or with sudo");
      console.log("               or see README for information on running without root/sudo:");
      console.log("               https://github.com/sandeepmistry/bleno#running-on-linux");
    } else if (state === "unsupported") {
      console.log("bleno warning: adapter does not support Bluetooth Low Energy (BLE, Bluetooth Smart).");
      console.log("               Try to run with environment variable:");
      console.log("               [sudo] BLENO_HCI_DEVICE_ID=x node ...");
    }

    this.emit("stateChange", state);
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
    this._aclStream = new AclStream(this._hci, handle, this._hci.addressType, this._hci.address, addressType, address);
    this._gatt.setAclStream(this._aclStream);

    this.emit("accept", address);
  }

  public onLeConnUpdateComplete(handle: any, interval?: any, latency?: any, supervisionTimeout?: any) {
    // no-op
  }

  public async onDisconnCompleteWait(handle: any, reason?: any) {
    if (this._handle !== handle) {
      return; // not peripheral
    }
    if (this._aclStream) {
      this._aclStream.end();
      this._aclStream = null;
    }

    const address = this._address;

    this._address = null;
    this._handle = null;

    if (address) {
      this.emit("disconnect", address, reason); // TODO: use reason
    }

    if (this._advertising) {
      await this._gap.restartAdvertisingWait();
    }
  }

  public onEncryptChange(handle: any, encrypt?: any) {
    if (this._handle === handle && this._aclStream) {
      this._aclStream.pushEncrypt(encrypt);
    }
  }

  public onMtuChange(mtu: any) {
    this.emit("mtuChange", mtu);
  }

  public onAclDataPkt(handle: Handle, cid?: any, data?: any) {
    if (this._handle === handle && this._aclStream) {
      this._aclStream.push(cid, data);
    }
  }
}

export default BlenoBindings;
