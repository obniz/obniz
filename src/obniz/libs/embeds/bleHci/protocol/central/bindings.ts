/**
 * @packageDocumentation
 *
 * @ignore
 */
// var debug = require('debug')('bindings');

import EventEmitter from "eventemitter3";

import { ObnizBleHciStateError, ObnizBleUnknownPeripheralError, ObnizError } from "../../../../../ObnizError";
import { BleDeviceAddress, BleDeviceAddressType, Handle, UUID } from "../../bleTypes";
import Hci from "../hci";
import AclStream from "./acl-stream";
import Gap from "./gap";
import Gatt from "./gatt";
import Signaling from "./signaling";

type NobleBindingsEventType =
  // notify from peripheral
  | "discover" // for onfind
  | "disconnect"
  | "stateChange"
  | "notification"
  | "handleNotify";

/**
 * @ignore
 */
class NobleBindings extends EventEmitter<NobleBindingsEventType> {
  public _connectable: any;

  private _state: any;
  private _addresses: { [uuid: string]: BleDeviceAddress };
  private _addresseTypes: { [uuid: string]: BleDeviceAddressType };
  private _handles: any;
  private _gatts: { [handle: string]: Gatt };
  private _aclStreams: { [key: string]: AclStream };
  private _signalings: any;
  private _hci: Hci;
  private _gap: Gap;
  private _scanServiceUuids: any;
  private _connectPromises: Array<Promise<any>>;

  constructor(hciProtocol: any) {
    super();
    this._hci = hciProtocol;
    this._gap = new Gap(this._hci);

    this._state = null;

    this._addresses = {};
    this._addresseTypes = {};
    this._connectable = {};

    this._handles = {};
    this._gatts = {};
    this._aclStreams = {};
    this._signalings = {};
    this._connectPromises = [];

    this._hci.on("stateChange", this.onStateChange.bind(this));
    this._hci.on("disconnComplete", this.onDisconnComplete.bind(this));
    this._hci.on("aclDataPkt", this.onAclDataPkt.bind(this));

    this._gap.on("discover", this.onDiscover.bind(this));
  }

  /**
   * @ignore
   * @private
   */
  public _reset() {
    this._state = null;

    this._addresses = {};
    this._addresseTypes = {};
    this._connectable = {};

    this._handles = {};
    this._gatts = {};
    this._aclStreams = {};
    this._signalings = {};
    this._gap._reset();

    // TODO: It muset be canceled.
    this._connectPromises = [];
  }

  public debugHandler: any = () => {};

  public addPeripheralData(uuid: UUID, addressType: BleDeviceAddressType) {
    if (!this._addresses[uuid]) {
      const address: any = uuid.match(/.{1,2}/g)!.join(":");
      this._addresses[uuid] = address;
      this._addresseTypes[uuid] = addressType;
      this._connectable[uuid] = true;
    }
  }

  public async startScanningWait(serviceUuids: any, allowDuplicates: any, activeScan: boolean) {
    this._scanServiceUuids = serviceUuids || [];

    await this._gap.startScanningWait(allowDuplicates, activeScan);
  }

  public async stopScanningWait() {
    await this._gap.stopScanningWait();
  }

  public async connectWait(peripheralUuid: any, onConnectCallback?: any) {
    const address: any = this._addresses[peripheralUuid];
    const addressType: any = this._addresseTypes[peripheralUuid];

    // Block parall connection ongoing for ESP32 bug.
    const doPromise = Promise.all(this._connectPromises)
      .catch((error) => {
        // nothing
      })
      .then(() => {
        return this._hci.createLeConnWait(address, addressType, 90 * 1000); // connection timeout for 90 secs.
      })
      .then((result) => {
        this.onLeConnComplete(
          result.status,
          result.handle,
          result.role,
          result.addressType,
          result.address,
          result.interval,
          result.latency,
          result.supervisionTimeout,
          result.masterClockAccuracy,
        );
        if (onConnectCallback && typeof onConnectCallback === "function") {
          onConnectCallback();
        }
        return this._gatts[result.handle].exchangeMtuWait(256);
      })
      .then(
        (result) => {
          this._connectPromises = this._connectPromises.filter((e) => e === doPromise);
          return Promise.resolve(result);
        },
        (error) => {
          this._connectPromises = this._connectPromises.filter((e) => e === doPromise);
          return Promise.reject(error);
        },
      );
    this._connectPromises.push(doPromise);
    return doPromise;
  }

  public disconnect(peripheralUuid: any) {
    this._hci.disconnect(this._handles[peripheralUuid]);
  }

  public async updateRssiWait(peripheralUuid: UUID) {
    const rssi = await this._hci.readRssiWait(this._handles[peripheralUuid]);
    return rssi;
  }

  public onStateChange(state: any) {
    if (this._state === state) {
      return;
    }
    this._state = state;

    if (state === "unauthorized") {
      console.log("noble warning: adapter state unauthorized, please run as root or with sudo");
      console.log("               or see README for information on running without root/sudo:");
      console.log("               https://github.com/sandeepmistry/noble#running-on-linux");
    } else if (state === "unsupported") {
      console.log("noble warning: adapter does not support Bluetooth Low Energy (BLE, Bluetooth Smart).");
      console.log("               Try to run with environment variable:");
      console.log("               [sudo] NOBLE_HCI_DEVICE_ID=x node ...");
    }

    this.emit("stateChange", state);
  }

  public onDiscover(status: any, address?: any, addressType?: any, connectable?: any, advertisement?: any, rssi?: any) {
    if (this._scanServiceUuids === undefined) {
      return;
    }

    let serviceUuids: any = advertisement.serviceUuids || [];
    const serviceData: any = advertisement.serviceData || [];
    let hasScanServiceUuids: any = this._scanServiceUuids.length === 0;

    if (!hasScanServiceUuids) {
      let i: any;

      serviceUuids = serviceUuids.slice();

      for (i in serviceData) {
        serviceUuids.push(serviceData[i].uuid);
      }

      for (i in serviceUuids) {
        hasScanServiceUuids = this._scanServiceUuids.indexOf(serviceUuids[i]) !== -1;

        if (hasScanServiceUuids) {
          break;
        }
      }
    }

    if (hasScanServiceUuids) {
      const uuid: any = address.split(":").join("");
      this._addresses[uuid] = address;
      this._addresseTypes[uuid] = addressType;
      this._connectable[uuid] = connectable;

      this.emit("discover", uuid, address, addressType, connectable, advertisement, rssi);
    }
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
    if (role !== 0) {
      // not master, ignore
      return;
    }

    let uuid: any = null;

    if (status !== 0) {
      throw new ObnizBleHciStateError(status);
    }
    uuid = address
      .split(":")
      .join("")
      .toLowerCase();

    const aclStream: AclStream = new AclStream(
      this._hci,
      handle,
      this._hci.addressType,
      this._hci.address,
      addressType,
      address,
    );
    aclStream.debugHandler = (text: any) => {
      this.debug(text);
    };
    const gatt = new Gatt(address, aclStream);
    const signaling: any = new Signaling(handle, aclStream);

    this._gatts[uuid] = this._gatts[handle] = gatt;
    this._signalings[uuid] = this._signalings[handle] = signaling;
    this._aclStreams[handle] = aclStream;
    this._handles[uuid] = handle;
    this._handles[handle] = uuid;

    this._gatts[handle].on("notification", this.onNotification.bind(this));
    this._gatts[handle].on("handleNotify", this.onHandleNotify.bind(this));

    this._signalings[handle].on("connectionParameterUpdateRequest", this.onConnectionParameterUpdateWait.bind(this));

    // public onMtu(address: any, mtu?: any) {}
  }

  public onDisconnComplete(handle: any, reason: number) {
    const uuid: any = this._handles[handle];

    if (uuid) {
      const error = new ObnizBleHciStateError(reason, { peripheralAddress: uuid });
      this._gatts[handle].onEnd(error);
      this._gatts[handle].removeAllListeners();
      this._signalings[handle].removeAllListeners();

      delete this._gatts[uuid];
      delete this._gatts[handle];
      delete this._signalings[uuid];
      delete this._signalings[handle];
      delete this._aclStreams[handle];
      delete this._handles[uuid];
      delete this._handles[handle];

      this.emit("disconnect", uuid, error); // TODO: handle reason?
    } else {
      // maybe disconnect as peripheral
      // console.warn(
      //   'noble warning: unknown handle ' + handle + ' disconnected!'
      // );
    }
  }

  public onAclDataPkt(handle: any, cid?: any, data?: any) {
    const aclStream: AclStream = this._aclStreams[handle];

    if (aclStream) {
      aclStream.push(cid, data);
    }
  }

  public async discoverServicesWait(peripheralUuid: any, uuids?: any) {
    const gatt: Gatt = this.getGatt(peripheralUuid);

    const services = await gatt.discoverServicesWait(uuids || []);
    return services;
  }

  public async discoverIncludedServicesWait(peripheralUuid: string, serviceUuid: UUID, serviceUuids: UUID[]) {
    const gatt: Gatt = this.getGatt(peripheralUuid);

    const services = gatt.discoverIncludedServicesWait(serviceUuid, serviceUuids || []);
    return services;
  }

  public async discoverCharacteristicsWait(peripheralUuid: any, serviceUuid: any, characteristicUuids?: any) {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    const chars = await gatt.discoverCharacteristicsWait(serviceUuid, characteristicUuids || []);
    return chars;
  }

  public async readWait(peripheralUuid: any, serviceUuid: any, characteristicUuid: any): Promise<Buffer> {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    const data = await gatt.readWait(serviceUuid, characteristicUuid);
    return data;
  }

  public async writeWait(
    peripheralUuid: any,
    serviceUuid: any,
    characteristicUuid: any,
    data: any,
    withoutResponse: any,
  ): Promise<void> {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    await gatt.writeWait(serviceUuid, characteristicUuid, data, withoutResponse);
  }

  public async broadcastWait(
    peripheralUuid: any,
    serviceUuid: any,
    characteristicUuid: any,
    broadcast: any,
  ): Promise<void> {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    await gatt.broadcastWait(serviceUuid, characteristicUuid, broadcast);
  }

  public async notifyWait(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, notify: any) {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    await gatt.notifyWait(serviceUuid, characteristicUuid, notify);
  }

  public onNotification(address: any, serviceUuid?: any, characteristicUuid?: any, data?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("notification", uuid, serviceUuid, characteristicUuid, data, true, true);
  }

  public async discoverDescriptorsWait(peripheralUuid: any, serviceUuid: any, characteristicUuid: any) {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    const descriptors = await gatt.discoverDescriptorsWait(serviceUuid, characteristicUuid);
    return descriptors;
  }

  public async readValueWait(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, descriptorUuid: any) {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    const resp = await gatt.readValueWait(serviceUuid, characteristicUuid, descriptorUuid);
    return resp;
  }

  public async writeValueWait(
    peripheralUuid: any,
    serviceUuid: any,
    characteristicUuid: any,
    descriptorUuid: any,
    data: any,
  ) {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    await gatt.writeValueWait(serviceUuid, characteristicUuid, descriptorUuid, data);
  }

  public async readHandleWait(peripheralUuid: any, attHandle: any): Promise<Buffer> {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    const data = await gatt.readHandleWait(attHandle);
    return data;
  }

  public async writeHandleWait(peripheralUuid: any, attHandle: any, data: any, withoutResponse: any): Promise<void> {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    await gatt.writeHandleWait(attHandle, data, withoutResponse);
  }

  public onHandleNotify(address: any, handle?: any, data?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("handleNotify", uuid, handle, data);
  }

  public async onConnectionParameterUpdateWait(
    handle: Handle,
    minInterval?: any,
    maxInterval?: any,
    latency?: any,
    supervisionTimeout?: any,
  ) {
    await this._hci.connUpdateLeWait(handle, minInterval, maxInterval, latency, supervisionTimeout);
    // this.onLeConnUpdateComplete(); is nop
  }

  public async pairingWait(peripheralUuid: any, options?: any): Promise<string> {
    options = options || {};
    const gatt: Gatt = this.getGatt(peripheralUuid);
    const result = await gatt.encryptWait(options);
    return result;
  }

  public async setPairingOption(peripheralUuid: any, options: any) {
    options = options || {};
    const gatt: Gatt = this.getGatt(peripheralUuid);
    gatt.setEncryptOption(options);
  }

  private getGatt(peripheralUuid: any): Gatt {
    const handle = this._handles[peripheralUuid];
    const gatt: Gatt = this._gatts[handle];

    if (!gatt) {
      throw new ObnizBleUnknownPeripheralError(peripheralUuid);
    }
    return gatt;
  }

  private debug(text: any) {
    this.debugHandler(`${text}`);
  }
}

export default NobleBindings;
