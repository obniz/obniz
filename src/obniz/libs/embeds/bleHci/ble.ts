import BleHelper from "./bleHelper";
import ObnizBLEHci from "./hci";
import CentralBindings from "./protocol/central/bindings";
import HciProtocol from "./protocol/hci";
import PeripheralBindings from "./protocol/peripheral/bindings";

import Obniz from "../../../index";
import BleAdvertisement from "./bleAdvertisement";
import BleCharacteristic from "./bleCharacteristic";
import BleDescriptor from "./bleDescriptor";
import BlePeripheral from "./blePeripheral";
import BleRemotePeripheral from "./bleRemotePeripheral";
import BleScan from "./bleScan";
import BleSecurity from "./bleSecurity";
import BleService from "./bleService";
import {BleDeviceAddressType, UUID} from "./bleTypes";

class ObnizBLE {

  public static _dataArray2uuidHex(data: number[], reverse: boolean): UUID {
    let uuid: any = [];
    for (let i = 0; i < data.length; i++) {
      uuid.push(("00" + data[i].toString(16).toLowerCase()).slice(-2));
    }
    if (reverse) {
      uuid = uuid.reverse();
    }
    let str: any = uuid.join("");
    if (uuid.length >= 16) {
      str =
        str.slice(0, 8) +
        "-" +
        str.slice(8, 12) +
        "-" +
        str.slice(12, 16) +
        "-" +
        str.slice(16, 20) +
        "-" +
        str.slice(20);
    }
    return str;
  }

  public Obniz: Obniz;
  public hci: ObnizBLEHci;
  public hciProtocol: HciProtocol;
  public centralBindings: CentralBindings;
  public peripheralBindings: PeripheralBindings;
  public _initialized: boolean;
  public _initializeWarning: boolean;
  public remotePeripherals: BleRemotePeripheral[];
  public service: typeof BleService;
  public characteristic: typeof BleCharacteristic;
  public descriptor: typeof BleDescriptor;
  public peripheral: BlePeripheral;
  public advertisement: any;
  public scan: BleScan;
  public security: any;

  constructor(obniz: Obniz) {
    this.Obniz = obniz;
    this.hci = new ObnizBLEHci(obniz);
    this.hciProtocol = new HciProtocol(this.hci);

    this.centralBindings = new CentralBindings(this.hciProtocol);
    this.peripheralBindings = new PeripheralBindings(this.hciProtocol);

    // let dummy = {write : ()=>{}, on:()=>{}}
    // this.centralBindings = new CentralBindings( dummy );
    // this.peripheralBindings = new PeripheralBindings( dummy );

    this.centralBindings.init();
    this.peripheralBindings.init();

    this._initialized = false;
    this._initializeWarning = true;

    this.remotePeripherals = [];

    this.service = BleService;
    this.characteristic = BleCharacteristic;
    this.descriptor = BleDescriptor;
    this.peripheral = new BlePeripheral(this);

    this.advertisement = new BleAdvertisement(this);
    this.scan = new BleScan(this);
    this.security = new BleSecurity(this);

    this._bind();
    this._reset();
  }

  public async initWait(): Promise<void> {
    if (!this._initialized) {
      this._initialized = true;
      await this.hciProtocol.initWait();
    }
  }

  public warningIfNotInitialize() {
    if (!this._initialized && this._initializeWarning) {
      this._initializeWarning = true;
      this.Obniz.warning({
        alert: "warning",
        message: `BLE is not initialized. Please call 'await obniz.ble.initWait()'`,
      });
    }
  }

  public notified(obj: any) {
    if (obj.hci) {
      this.hci.notified(obj.hci);
    }
  }

  public _reset() {
  }

  public directConnect(uuid: UUID, addressType: BleDeviceAddressType) {
    let peripheral: any = this.findPeripheral(uuid);
    if (!peripheral) {
      peripheral = new BleRemotePeripheral(this, uuid);
      this.remotePeripherals.push(peripheral);
    }
    if (!this.centralBindings._addresses[uuid]) {
      const address: any = uuid.match(/.{1,2}/g)!.join(":");
      this.centralBindings._addresses[uuid] = address;
      this.centralBindings._addresseTypes[uuid] = addressType;
      this.centralBindings._connectable[uuid] = true;
    }
    peripheral.connect();
    return peripheral;
  }

  public async directConnectWait(uuid: any, addressType: any) {
    const peripheral: any = this.directConnect(uuid, addressType);
    await peripheral.connectWait();
    return peripheral;
  }

  public findPeripheral(address: any) {
    for (const key in this.remotePeripherals) {
      if (this.remotePeripherals[key].address === address) {
        return this.remotePeripherals[key];
      }
    }
    return null;
  }

  public onStateChange() {
  }

  public onAddressChange() {
  }

  public onScanStart() {
  }

  public onScanStop() {
    this.scan.notifyFromServer("onfinish", null);
  }

  public onDiscover(uuid: any, address?: any, addressType?: any, connectable?: any, advertisement?: any, rssi?: any) {
    let val: any = this.findPeripheral(uuid);
    if (!val) {
      val = new BleRemotePeripheral(this, uuid);
      this.remotePeripherals.push(val);
    }
    val.discoverdOnRemote = true;

    const peripheralData: any = {
      device_type: "ble",
      address_type: addressType,
      ble_event_type: connectable
        ? "connectable_advertisemnt"
        : "non_connectable_advertising",
      rssi,
      adv_data: advertisement.advertisementRaw,
      scan_resp: advertisement.scanResponseRaw,
    };

    val.setParams(peripheralData);
    val._adv_data_filtered = advertisement;

    this.scan.notifyFromServer("onfind", val);
  }

  public async onConnect(peripheralUuid: any, error?: any) {
    const peripheral: any = this.findPeripheral(peripheralUuid);
    if (!error) {
      await peripheral.discoverAllHandlesWait();
    }
    peripheral.notifyFromServer("statusupdate", {
      status: error ? "disconnected" : "connected",
    });
  }

  public onDisconnect(peripheralUuid: any) {
    const peripheral: any = this.findPeripheral(peripheralUuid);
    peripheral.notifyFromServer("statusupdate", {status: "disconnected"});
  }

  public onRssiUpdate() {
  }

  public onServicesDiscover(peripheralUuid: any, serviceUuids?: any) {
    const peripheral: any = this.findPeripheral(peripheralUuid);
    for (const serviceUuid of serviceUuids) {
      peripheral.notifyFromServer("discover", {service_uuid: serviceUuid});
    }
    peripheral.notifyFromServer("discoverfinished", {});
  }

  public onIncludedServicesDiscover(
    peripheralUuid: any,
    serviceUuid?: any,
    includedServiceUuids?: any,
  ) {
  }

  public onCharacteristicsDiscover(peripheralUuid: any, serviceUuid?: any, characteristics?: any) {
    const peripheral: any = this.findPeripheral(peripheralUuid);
    const service: any = peripheral.findService({service_uuid: serviceUuid});
    for (const char of characteristics) {
      const obj: any = {
        properties: char.properties.map((e: any) => BleHelper.toSnakeCase(e)),
        characteristic_uuid: char.uuid,
      };
      service.notifyFromServer("discover", obj);
    }
    service.notifyFromServer("discoverfinished", {});
  }

  public onRead(
    peripheralUuid: any,
    serviceUuid?: any,
    characteristicUuid?: any,
    data?: any,
    isNotification?: any,
    isSuccess?: any,
  ) {
    const peripheral: any = this.findPeripheral(peripheralUuid);
    const characteristic: any = peripheral.findCharacteristic({
      service_uuid: serviceUuid,
      characteristic_uuid: characteristicUuid,
    });

    if (isNotification) {
      const obj: any = {
        data: Array.from(data),
      };
      characteristic.notifyFromServer("onnotify", obj);
    } else {
      const obj: any = {
        result: isSuccess ? "success" : "failed",
        data: Array.from(data),
      };
      characteristic.notifyFromServer("onread", obj);
    }
  }

  public onWrite(peripheralUuid: any, serviceUuid?: any, characteristicUuid?: any, isSuccess?: any) {
    const peripheral: any = this.findPeripheral(peripheralUuid);
    const characteristic: any = peripheral.findCharacteristic({
      service_uuid: serviceUuid,
      characteristic_uuid: characteristicUuid,
    });
    characteristic.notifyFromServer("onwrite", {
      result: isSuccess ? "success" : "failed",
    });
  }

  public onBroadcast(peripheralUuid: any, serviceUuid?: any, characteristicUuid?: any, state?: any) {
  }

  public onNotify(peripheralUuid: any, serviceUuid?: any, characteristicUuid?: any, state?: any) {
    const peripheral: any = this.findPeripheral(peripheralUuid);
    const char: any = peripheral.findCharacteristic({
      service_uuid: serviceUuid,
      characteristic_uuid: characteristicUuid,
    });

    if (state) {
      char.notifyFromServer("onregisternotify", {});
    } else {
      char.notifyFromServer("onunregisternotify", {});
    }
  }

  public onDescriptorsDiscover(
    peripheralUuid: any,
    serviceUuid?: any,
    characteristicUuid?: any,
    descriptors?: any,
  ) {
    const peripheral: any = this.findPeripheral(peripheralUuid);
    const char: any = peripheral.findCharacteristic({
      service_uuid: serviceUuid,
      characteristic_uuid: characteristicUuid,
    });
    for (const descr of descriptors) {
      const obj: any = {
        descriptor_uuid: descr,
      };
      char.notifyFromServer("discover", obj);
    }
    char.notifyFromServer("discoverfinished", {});
  }

  public onValueRead(
    peripheralUuid: any,
    serviceUuid?: any,
    characteristicUuid?: any,
    descriptorUuid?: any,
    data?: any,
    isSuccess?: any,
  ) {
    const peripheral: any = this.findPeripheral(peripheralUuid);
    const descriptor: any = peripheral.findDescriptor({
      service_uuid: serviceUuid,
      characteristic_uuid: characteristicUuid,
      descriptor_uuid: descriptorUuid,
    });

    const obj: any = {
      result: isSuccess ? "success" : "failed",
      data: Array.from(data),
    };
    descriptor.notifyFromServer("onread", obj);
  }

  public onValueWrite(
    peripheralUuid: any,
    serviceUuid?: any,
    characteristicUuid?: any,
    descriptorUuid?: any,
    isSuccess?: any,
  ) {
    const peripheral: any = this.findPeripheral(peripheralUuid);
    const descriptor: any = peripheral.findDescriptor({
      service_uuid: serviceUuid,
      characteristic_uuid: characteristicUuid,
      descriptor_uuid: descriptorUuid,
    });

    const obj: any = {
      result: isSuccess ? "success" : "failed",
    };
    descriptor.notifyFromServer("onwrite", obj);
  }

  public onHandleRead(peripheralUuid: any, handle?: any, data?: any) {
  }

  public onHandleWrite(peripheralUuid: any, handle?: any) {
  }

  public onHandleNotify(peripheralUuid: any, handle?: any, data?: any) {
  }

  public onPeripheralStateChange(state: any) {
    // console.error("onPeripheralStateChange")
  }

  public onPeripheralAddressChange(address: any) {
    // console.error("onPeripheralAddressChange")
  }

  public onPeripheralPlatform(platform: any) {
    // console.error("onPeripheralPlatform")
  }

  public onPeripheralAdvertisingStart(error: any) {
    // console.error("onPeripheralAdvertisingStart")
  }

  public onPeripheralAdvertisingStop() {
    // console.error("onPeripheralAdvertisingStop")
  }

  public onPeripheralServicesSet(error: any) {
    // console.error("onPeripheralServicesSet")
  }

  public onPeripheralAccept(clientAddress: any) {
    this.peripheral.currentConnectedDeviceAddress = clientAddress;
    this.peripheral.onconnectionupdates({
      address: clientAddress,
      status: "connected",
    });
  }

  public onPeripheralMtuChange(mtu: any) {
    // console.error("onPeripheralMtuChange")
  }

  public onPeripheralDisconnect(clientAddress: any) {
    this.peripheral.currentConnectedDeviceAddress = null;
    this.peripheral.onconnectionupdates({
      address: clientAddress,
      status: "disconnected",
    });
  }

  public onPeripheralRssiUpdate(rssi: any) {
    // console.error("onPeripheralRssiUpdate")
  }

  public _bind() {
    this.centralBindings.on("stateChange", this.onStateChange.bind(this));

    this.centralBindings.on("addressChange", this.onAddressChange.bind(this));

    this.centralBindings.on("scanStart", this.onScanStart.bind(this));
    this.centralBindings.on("scanStop", this.onScanStop.bind(this));
    this.centralBindings.on("discover", this.onDiscover.bind(this));
    this.centralBindings.on("connect", this.onConnect.bind(this));
    this.centralBindings.on("disconnect", this.onDisconnect.bind(this));
    this.centralBindings.on("rssiUpdate", this.onRssiUpdate.bind(this));
    this.centralBindings.on(
      "servicesDiscover",
      this.onServicesDiscover.bind(this),
    );
    this.centralBindings.on(
      "includedServicesDiscover",
      this.onIncludedServicesDiscover.bind(this),
    );
    this.centralBindings.on(
      "characteristicsDiscover",
      this.onCharacteristicsDiscover.bind(this),
    );

    this.centralBindings.on("read", this.onRead.bind(this));
    this.centralBindings.on("write", this.onWrite.bind(this));
    this.centralBindings.on("broadcast", this.onBroadcast.bind(this));
    this.centralBindings.on("notify", this.onNotify.bind(this));
    this.centralBindings.on(
      "descriptorsDiscover",
      this.onDescriptorsDiscover.bind(this),
    );
    this.centralBindings.on("valueRead", this.onValueRead.bind(this));
    this.centralBindings.on("valueWrite", this.onValueWrite.bind(this));
    this.centralBindings.on("handleRead", this.onHandleRead.bind(this));
    this.centralBindings.on("handleWrite", this.onHandleWrite.bind(this));
    this.centralBindings.on("handleNotify", this.onHandleNotify.bind(this));

    this.peripheralBindings.on(
      "stateChange",
      this.onPeripheralStateChange.bind(this),
    );
    this.peripheralBindings.on(
      "addressChange",
      this.onPeripheralAddressChange.bind(this),
    );
    this.peripheralBindings.on(
      "platform",
      this.onPeripheralPlatform.bind(this),
    );
    this.peripheralBindings.on(
      "advertisingStart",
      this.onPeripheralAdvertisingStart.bind(this),
    );
    this.peripheralBindings.on(
      "advertisingStop",
      this.onPeripheralAdvertisingStop.bind(this),
    );
    this.peripheralBindings.on(
      "servicesSet",
      this.onPeripheralServicesSet.bind(this),
    );
    this.peripheralBindings.on("accept", this.onPeripheralAccept.bind(this));
    this.peripheralBindings.on(
      "mtuChange",
      this.onPeripheralMtuChange.bind(this),
    );
    this.peripheralBindings.on(
      "disconnect",
      this.onPeripheralDisconnect.bind(this),
    );

    this.peripheralBindings.on(
      "rssiUpdate",
      this.onPeripheralRssiUpdate.bind(this),
    );
  }
}

export default ObnizBLE;
