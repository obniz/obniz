/**
 * @packageDocumentation
 *
 * @ignore
 */
// var debug = require('debug')('bindings');

import events from "events";

import { UUID } from "../../bleTypes";
import Hci from "../hci";
import AclStream from "./acl-stream";
import Gap from "./gap";
import Gatt from "./gatt";
import Signaling from "./signaling";
/**
 * @ignore
 */
class NobleBindings extends events.EventEmitter {
  public _state: any;
  public _addresses: any;
  public _addresseTypes: any;
  public _connectable: any;
  public _pendingConnectionUuid: any;
  public _connectionQueue: any;
  public _handles: any;
  public _gatts: any;
  public _aclStreams: any;
  public _signalings: any;
  public _hci: Hci;
  public _gap: any;
  public _scanServiceUuids: any;

  constructor(hciProtocol: any) {
    super();
    this._state = null;

    this._addresses = {};
    this._addresseTypes = {};
    this._connectable = {};

    this._pendingConnectionUuid = null;
    this._connectionQueue = [];

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

  public stopScanning() {
    this._gap.stopScanning();
  }

  public connect(peripheralUuid: any) {
    const address: any = this._addresses[peripheralUuid];
    const addressType: any = this._addresseTypes[peripheralUuid];

    if (!this._pendingConnectionUuid) {
      this._pendingConnectionUuid = peripheralUuid;

      this._hci.createLeConn(address, addressType);
    } else {
      this._connectionQueue.push(peripheralUuid);
    }
  }

  public disconnect(peripheralUuid: any) {
    this._hci.disconnect(this._handles[peripheralUuid]);
  }

  public async updateRssiWait(peripheralUuid: UUID) {
    const rssi = await this._hci.readRssiWait(this._handles[peripheralUuid]);
    this.emit("rssiUpdate", this._handles[peripheralUuid], rssi);
    return rssi;
  }

  public init() {
    this._gap.on("scanStart", this.onScanStart.bind(this));
    this._gap.on("scanStop", this.onScanStop.bind(this));
    this._gap.on("discover", this.onDiscover.bind(this));

    this._hci.on("stateChange", this.onStateChange.bind(this));
    this._hci.on("addressChange", this.onAddressChange.bind(this));
    this._hci.on("leConnComplete", this.onLeConnComplete.bind(this));
    this._hci.on("leConnUpdateComplete", this.onLeConnUpdateComplete.bind(this));
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

    let error: any = null;

    if (status === 0) {
      uuid = address
        .split(":")
        .join("")
        .toLowerCase();

      const aclStream: any = new AclStream(
        this._hci,
        handle,
        this._hci.addressType,
        this._hci.address,
        addressType,
        address,
      );
      const gatt: any = new Gatt(address, aclStream);
      const signaling: any = new Signaling(handle, aclStream);

      this._gatts[uuid] = this._gatts[handle] = gatt;
      this._signalings[uuid] = this._signalings[handle] = signaling;
      this._aclStreams[handle] = aclStream;
      this._handles[uuid] = handle;
      this._handles[handle] = uuid;

      this._gatts[handle].on("mtu", this.onMtu.bind(this));
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

      this._signalings[handle].on(
        "connectionParameterUpdateRequest",
        this.onConnectionParameterUpdateRequest.bind(this),
      );

      this._gatts[handle].exchangeMtu(256);
    } else {
      uuid = this._pendingConnectionUuid;
      let statusMessage: any = Hci.STATUS_MAPPER[status] || "HCI Error: Unknown";
      const errorCode: any = " (0x" + status.toString(16) + ")";
      statusMessage = statusMessage + errorCode;
      error = new Error(statusMessage);
    }

    this.emit("connect", uuid, error);

    if (this._connectionQueue.length > 0) {
      const peripheralUuid: any = this._connectionQueue.shift();

      address = this._addresses[peripheralUuid];
      addressType = this._addresseTypes[peripheralUuid];

      this._pendingConnectionUuid = peripheralUuid;

      this._hci.createLeConn(address, addressType);
    } else {
      this._pendingConnectionUuid = null;
    }
  }

  public onLeConnUpdateComplete(handle: any, interval?: any, latency?: any, supervisionTimeout?: any) {
    // no-op
  }

  public onDisconnComplete(handle: any, reason?: any) {
    const uuid: any = this._handles[handle];

    if (uuid) {
      this._aclStreams[handle].push(null, null);
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

  public onMtu(address: any, mtu?: any) {}

  public onRssiRead(handle: any, rssi?: any) {
    this.emit("rssiUpdate", this._handles[handle], rssi);
  }

  public onAclDataPkt(handle: any, cid?: any, data?: any) {
    const aclStream: any = this._aclStreams[handle];

    if (aclStream) {
      aclStream.push(cid, data);
    }
  }

  public discoverServices(peripheralUuid: any, uuids?: any) {
    const handle: any = this._handles[peripheralUuid];
    const gatt: any = this._gatts[handle];

    if (gatt) {
      gatt.discoverServices(uuids || []);
    } else {
      console.warn("noble warning: unknown peripheral " + peripheralUuid);
    }
  }

  public onServicesDiscovered(address: any, serviceUuids?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("servicesDiscover", uuid, serviceUuids);
  }

  public discoverIncludedServices(peripheralUuid: any, serviceUuid: any, serviceUuids: any) {
    const handle: any = this._handles[peripheralUuid];
    const gatt: any = this._gatts[handle];

    if (gatt) {
      gatt.discoverIncludedServices(serviceUuid, serviceUuids || []);
    } else {
      console.warn("noble warning: unknown peripheral " + peripheralUuid);
    }
  }

  public onIncludedServicesDiscovered(address: any, serviceUuid?: any, includedServiceUuids?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("includedServicesDiscover", uuid, serviceUuid, includedServiceUuids);
  }

  public discoverCharacteristics(peripheralUuid: any, serviceUuid: any, characteristicUuids?: any) {
    const handle: any = this._handles[peripheralUuid];
    const gatt: any = this._gatts[handle];

    if (gatt) {
      gatt.discoverCharacteristics(serviceUuid, characteristicUuids || []);
    } else {
      console.warn("noble warning: unknown peripheral " + peripheralUuid);
    }
  }

  public onCharacteristicsDiscovered(address: any, serviceUuid?: any, characteristics?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("characteristicsDiscover", uuid, serviceUuid, characteristics);
  }

  public read(peripheralUuid: any, serviceUuid: any, characteristicUuid: any) {
    const handle: any = this._handles[peripheralUuid];
    const gatt: any = this._gatts[handle];

    if (gatt) {
      gatt.read(serviceUuid, characteristicUuid);
    } else {
      console.warn("noble warning: unknown peripheral " + peripheralUuid);
    }
  }

  public onRead(address: any, serviceUuid?: any, characteristicUuid?: any, data?: any, isSuccess?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("read", uuid, serviceUuid, characteristicUuid, data, false, isSuccess);
  }

  public write(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, data: any, withoutResponse: any) {
    const handle: any = this._handles[peripheralUuid];
    const gatt: any = this._gatts[handle];

    if (gatt) {
      gatt.write(serviceUuid, characteristicUuid, data, withoutResponse);
    } else {
      console.warn("noble warning: unknown peripheral " + peripheralUuid);
    }
  }

  public onWrite(address: any, serviceUuid?: any, characteristicUuid?: any, isSuccess?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("write", uuid, serviceUuid, characteristicUuid, isSuccess);
  }

  public broadcast(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, broadcast: any) {
    const handle: any = this._handles[peripheralUuid];
    const gatt: any = this._gatts[handle];

    if (gatt) {
      gatt.broadcast(serviceUuid, characteristicUuid, broadcast);
    } else {
      console.warn("noble warning: unknown peripheral " + peripheralUuid);
    }
  }

  public onBroadcast(address: any, serviceUuid?: any, characteristicUuid?: any, state?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("broadcast", uuid, serviceUuid, characteristicUuid, state);
  }

  public notify(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, notify: any) {
    const handle: any = this._handles[peripheralUuid];
    const gatt: any = this._gatts[handle];

    if (gatt) {
      gatt.notify(serviceUuid, characteristicUuid, notify);
    } else {
      console.warn("noble warning: unknown peripheral " + peripheralUuid);
    }
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

  public discoverDescriptors(peripheralUuid: any, serviceUuid: any, characteristicUuid: any) {
    const handle: any = this._handles[peripheralUuid];
    const gatt: any = this._gatts[handle];

    if (gatt) {
      gatt.discoverDescriptors(serviceUuid, characteristicUuid);
    } else {
      console.warn("noble warning: unknown peripheral " + peripheralUuid);
    }
  }

  public onDescriptorsDiscovered(address: any, serviceUuid?: any, characteristicUuid?: any, descriptorUuids?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("descriptorsDiscover", uuid, serviceUuid, characteristicUuid, descriptorUuids);
  }

  public readValue(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, descriptorUuid: any) {
    const handle: any = this._handles[peripheralUuid];
    const gatt: any = this._gatts[handle];

    if (gatt) {
      gatt.readValue(serviceUuid, characteristicUuid, descriptorUuid);
    } else {
      console.warn("noble warning: unknown peripheral " + peripheralUuid);
    }
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

  public writeValue(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, descriptorUuid: any, data: any) {
    const handle: any = this._handles[peripheralUuid];
    const gatt: any = this._gatts[handle];

    if (gatt) {
      gatt.writeValue(serviceUuid, characteristicUuid, descriptorUuid, data);
    } else {
      console.warn("noble warning: unknown peripheral " + peripheralUuid);
    }
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
    const handle: any = this._handles[peripheralUuid];
    const gatt: any = this._gatts[handle];

    if (gatt) {
      gatt.readHandle(attHandle);
    } else {
      console.warn("noble warning: unknown peripheral " + peripheralUuid);
    }
  }

  public onHandleRead(address: any, handle?: any, data?: any) {
    const uuid: any = address
      .split(":")
      .join("")
      .toLowerCase();

    this.emit("handleRead", uuid, handle, data);
  }

  public writeHandle(peripheralUuid: any, attHandle: any, data: any, withoutResponse: any) {
    const handle: any = this._handles[peripheralUuid];
    const gatt: any = this._gatts[handle];

    if (gatt) {
      gatt.writeHandle(attHandle, data, withoutResponse);
    } else {
      console.warn("noble warning: unknown peripheral " + peripheralUuid);
    }
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

  public onConnectionParameterUpdateRequest(
    handle: any,
    minInterval?: any,
    maxInterval?: any,
    latency?: any,
    supervisionTimeout?: any,
  ) {
    this._hci.connUpdateLe(handle, minInterval, maxInterval, latency, supervisionTimeout);
  }
}

export default NobleBindings;
