/**
 * @packageDocumentation
 *
 * @ignore
 */
// var debug = require('debug')('bindings');

import EventEmitter from "eventemitter3";

import { ObnizBleUnknownPeripheralError, ObnizError } from "../../../../../ObnizError";
import { BleDeviceAddress, BleDeviceAddressType, Handle, UUID } from "../../bleTypes";
import Hci from "../hci";
import AclStream from "./acl-stream";
import Gap from "./gap";
import Gatt from "./gatt";
import Signaling from "./signaling";

type NobleBindingsEventType =
  // response of command
  | "scanStart"
  | "scanStop"
  | "discover"
  | "connect"
  | "servicesDiscover"
  | "includedServicesDiscover"
  | "characteristicsDiscover"
  | "descriptorsDiscover"
  | "broadcast"
  | "write"
  | "read"
  | "valueWrite"
  | "valueRead"
  | "handleWrite"
  | "handleRead"

  // notify from peripheral
  | "disconnect"
  | "stateChange"
  | "addressChange"
  | "notify"
  | "handleNotify";

/**
 * @ignore
 */
class NobleBindings extends EventEmitter<NobleBindingsEventType> {
  public _state: any;
  public _addresses: { [uuid: string]: BleDeviceAddress };
  public _addresseTypes: { [uuid: string]: BleDeviceAddressType };
  public _connectable: any;
  public _connectPromises: Array<Promise<any>>;
  public _handles: any;
  public _gatts: { [handle: string]: Gatt };
  public _aclStreams: { [key: string]: AclStream };
  public _signalings: any;
  public _hci: Hci;
  public _gap: Gap;
  public _scanServiceUuids: any;

  constructor(hciProtocol: any) {
    super();
    this._state = null;

    this._addresses = {};
    this._addresseTypes = {};
    this._connectable = {};

    this._connectPromises = [];

    this._handles = {};
    this._gatts = {};
    this._aclStreams = {};
    this._signalings = {};

    this._hci = hciProtocol;
    this._gap = new Gap(this._hci);
  }

  public async startScanningWait(serviceUuids: any, allowDuplicates: any, activeScan: boolean) {
    this._scanServiceUuids = serviceUuids || [];

    await this._gap.startScanningWait(allowDuplicates, activeScan);
  }

  public async stopScanningWait() {
    await this._gap.stopScanningWait();
  }

  public connectWait(peripheralUuid: any) {
    const address: any = this._addresses[peripheralUuid];
    const addressType: any = this._addresseTypes[peripheralUuid];

    const doPromise = Promise.all(this._connectPromises)
      .then(() => {
        return this._hci.createLeConnWait(address, addressType);
      })
      .then((result) => {
        return this.onLeConnComplete(
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
      })
      .finally(() => {
        this._connectPromises = this._connectPromises.filter((e) => e === doPromise);
      });
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

  public init() {
    this._gap.on("scanStart", this.onScanStart.bind(this));
    this._gap.on("scanStop", this.onScanStop.bind(this));
    this._gap.on("discover", this.onDiscover.bind(this));

    this._hci.on("stateChange", this.onStateChange.bind(this));
    this._hci.on("addressChange", this.onAddressChange.bind(this));
    // this._hci.on("leConnComplete", this.onLeConnComplete.bind(this));
    // this._hci.on("leConnUpdateComplete", this.onLeConnUpdateComplete.bind(this));
    // this._hci.on("rssiRead", this.onRssiRead.bind(this));
    this._hci.on("disconnComplete", this.onDisconnComplete.bind(this));
    this._hci.on("encryptChange", this.onEncryptChange.bind(this));
    this._hci.on("aclDataPkt", this.onAclDataPkt.bind(this));
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

  public onAddressChange(address: any) {
    this.emit("addressChange", address);
  }

  public onScanStart(filterDuplicates: any) {
    this.emit("scanStart", filterDuplicates);
  }

  public onScanStop() {
    this.emit("scanStop");
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

  public async onLeConnComplete(
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

    const error: any = null;

    if (status === 0) {
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
      const gatt = new Gatt(address, aclStream);
      const signaling: any = new Signaling(handle, aclStream);

      this._gatts[uuid] = this._gatts[handle] = gatt;
      this._signalings[uuid] = this._signalings[handle] = signaling;
      this._aclStreams[handle] = aclStream;
      this._handles[uuid] = handle;
      this._handles[handle] = uuid;

      this._gatts[handle].on("servicesDiscover", this.onServicesDiscovered.bind(this));
      this._gatts[handle].on("includedServicesDiscover", this.onIncludedServicesDiscovered.bind(this));
      this._gatts[handle].on("characteristicsDiscover", this.onCharacteristicsDiscovered.bind(this));
      this._gatts[handle].on("read", this.onRead.bind(this));
      this._gatts[handle].on("write", this.onWrite.bind(this));
      this._gatts[handle].on("broadcast", this.onBroadcast.bind(this));
      this._gatts[handle].on("notify", this.onNotify.bind(this));
      this._gatts[handle].on("notification", this.onNotification.bind(this));
      this._gatts[handle].on("descriptorsDiscover", this.onDescriptorsDiscovered.bind(this));
      this._gatts[handle].on("valueRead", this.onValueRead.bind(this));
      this._gatts[handle].on("valueWrite", this.onValueWrite.bind(this));
      this._gatts[handle].on("handleRead", this.onHandleRead.bind(this));
      this._gatts[handle].on("handleWrite", this.onHandleWrite.bind(this));
      this._gatts[handle].on("handleNotify", this.onHandleNotify.bind(this));

      this._signalings[handle].on("connectionParameterUpdateRequest", this.onConnectionParameterUpdateWait.bind(this));

      await this._gatts[handle].exchangeMtuWait(256);
      // public onMtu(address: any, mtu?: any) {}
    } else {
      let statusMessage: any = Hci.STATUS_MAPPER[status] || "HCI Error: Unknown";
      const errorCode: any = " (0x" + status.toString(16) + ")";
      statusMessage = statusMessage + errorCode;
      throw new Error(statusMessage);
    }

    this.emit("connect", uuid, error);
  }

  public onDisconnComplete(handle: any, reason?: any) {
    const uuid: any = this._handles[handle];

    if (uuid) {
      this._gatts[handle].removeAllListeners();
      this._signalings[handle].removeAllListeners();

      delete this._gatts[uuid];
      delete this._gatts[handle];
      delete this._signalings[uuid];
      delete this._signalings[handle];
      delete this._aclStreams[handle];
      delete this._handles[uuid];
      delete this._handles[handle];

      this.emit("disconnect", uuid); // TODO: handle reason?
    } else {
      // maybe disconnect as peripheral
      // console.warn(
      //   'noble warning: unknown handle ' + handle + ' disconnected!'
      // );
    }
  }

  public onEncryptChange(handle: any, encrypt?: any) {
    const aclStream: any = this._aclStreams[handle];

    if (aclStream) {
      aclStream.pushEncrypt(encrypt);
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

  public onServicesDiscovered(address: any, serviceUuids?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("servicesDiscover", uuid, serviceUuids);
  }

  public async discoverIncludedServicesWait(peripheralUuid: string, serviceUuid: UUID, serviceUuids: UUID[]) {
    const gatt: Gatt = this.getGatt(peripheralUuid);

    const services = gatt.discoverIncludedServicesWait(serviceUuid, serviceUuids || []);
    return services;
  }

  public onIncludedServicesDiscovered(address: any, serviceUuid?: any, includedServiceUuids?: any) {
    const uuid = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("includedServicesDiscover", uuid, serviceUuid, includedServiceUuids);
  }

  public async discoverCharacteristicsWait(peripheralUuid: any, serviceUuid: any, characteristicUuids?: any) {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    const uuids = await gatt.discoverCharacteristicsWait(serviceUuid, characteristicUuids || []);
    return uuids;
  }

  public onCharacteristicsDiscovered(address: any, serviceUuid?: any, characteristics?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("characteristicsDiscover", uuid, serviceUuid, characteristics);
  }

  public async readWait(peripheralUuid: any, serviceUuid: any, characteristicUuid: any) {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    const data = await gatt.readWait(serviceUuid, characteristicUuid);
    return data;
  }

  public onRead(address: any, serviceUuid?: any, characteristicUuid?: any, data?: any, isSuccess?: any) {
    const uuid = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("read", uuid, serviceUuid, characteristicUuid, data, false, isSuccess);
  }

  public async writeWait(
    peripheralUuid: any,
    serviceUuid: any,
    characteristicUuid: any,
    data: any,
    withoutResponse: any,
  ) {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    const resp = await gatt.writeWait(serviceUuid, characteristicUuid, data, withoutResponse);
  }

  public onWrite(address: any, serviceUuid?: any, characteristicUuid?: any, isSuccess?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("write", uuid, serviceUuid, characteristicUuid, isSuccess);
  }

  public async broadcastWait(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, broadcast: any) {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    await gatt.broadcastWait(serviceUuid, characteristicUuid, broadcast);
  }

  public onBroadcast(address: any, serviceUuid?: any, characteristicUuid?: any, state?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("broadcast", uuid, serviceUuid, characteristicUuid, state);
  }

  public async notifyWait(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, notify: any) {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    await gatt.notifyWait(serviceUuid, characteristicUuid, notify);
  }

  public onNotify(address: any, serviceUuid?: any, characteristicUuid?: any, state?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("notify", uuid, serviceUuid, characteristicUuid, state);
  }

  public onNotification(address: any, serviceUuid?: any, characteristicUuid?: any, data?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("read", uuid, serviceUuid, characteristicUuid, data, true, true);
  }

  public async discoverDescriptorsWait(peripheralUuid: any, serviceUuid: any, characteristicUuid: any) {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    const uuids = await gatt.discoverDescriptorsWait(serviceUuid, characteristicUuid);
    return uuids;
  }

  public onDescriptorsDiscovered(address: any, serviceUuid?: any, characteristicUuid?: any, descriptorUuids?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("descriptorsDiscover", uuid, serviceUuid, characteristicUuid, descriptorUuids);
  }

  public async readValueWait(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, descriptorUuid: any) {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    const resp = await gatt.readValueWait(serviceUuid, characteristicUuid, descriptorUuid);
    return resp;
  }

  public onValueRead(
    address: any,
    serviceUuid?: any,
    characteristicUuid?: any,
    descriptorUuid?: any,
    data?: any,
    isSuccess?: any,
  ) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("valueRead", uuid, serviceUuid, characteristicUuid, descriptorUuid, data, isSuccess);
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

  public onValueWrite(
    address: any,
    serviceUuid?: any,
    characteristicUuid?: any,
    descriptorUuid?: any,
    isSuccess?: any,
  ) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("valueWrite", uuid, serviceUuid, characteristicUuid, descriptorUuid, isSuccess);
  }

  public readHandle(peripheralUuid: any, attHandle: any) {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    gatt.readHandle(attHandle);
  }

  public onHandleRead(address: any, handle?: any, data?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("handleRead", uuid, handle, data);
  }

  public async writeHandle(peripheralUuid: any, attHandle: any, data: any, withoutResponse: any) {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    await gatt.writeHandleWait(attHandle, data, withoutResponse);
  }

  public onHandleWrite(address: any, handle?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("handleWrite", uuid, handle);
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

  public pairing(peripheralUuid: any, keys?: any, callback?: any) {
    const gatt: Gatt = this.getGatt(peripheralUuid);
    gatt.encrypt(callback, keys);
  }

  private getGatt(peripheralUuid: any): Gatt {
    const handle = this._handles[peripheralUuid];
    const gatt: Gatt = this._gatts[handle];

    if (!gatt) {
      throw new ObnizBleUnknownPeripheralError(peripheralUuid);
    }
    return gatt;
  }
}

export default NobleBindings;
