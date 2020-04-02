/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */

import BleHelper from "./bleHelper";
import ObnizBLEHci from "./hci";
import CentralBindings from "./protocol/central/bindings";
import HciProtocol from "./protocol/hci";
import PeripheralBindings from "./protocol/peripheral/bindings";

import semver from "semver";
import Obniz from "../../../index";
import { ComponentAbstract } from "../../ComponentAbstact";
import BleAdvertisement from "./bleAdvertisement";
import BleCharacteristic from "./bleCharacteristic";
import BleDescriptor from "./bleDescriptor";
import BlePeripheral from "./blePeripheral";
import BleRemotePeripheral from "./bleRemotePeripheral";
import BleScan from "./bleScan";
import BleSecurity from "./bleSecurity";
import BleService from "./bleService";
import { BleDeviceAddress, BleDeviceAddressType, UUID } from "./bleTypes";

/**
 * Use a obniz device as a BLE device.
 * Peripheral and Central mode are supported
 */
export default class ObnizBLE extends ComponentAbstract {
  /**
   * @ignore
   *
   * @param data
   * @param reverse
   * @private
   */
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

  public hci: ObnizBLEHci;
  public peripheral: BlePeripheral;
  public scan: BleScan;
  public security: BleSecurity;

  /**
   * @ignore
   */
  public centralBindings: CentralBindings;

  /**
   * @ignore
   */
  public peripheralBindings: PeripheralBindings;
  public service: typeof BleService;
  public characteristic: typeof BleCharacteristic;
  public descriptor: typeof BleDescriptor;

  /**
   * @ignore
   */
  public advertisement: BleAdvertisement;
  protected hciProtocol: HciProtocol;
  protected _initialized: boolean;
  protected _initializeWarning: boolean;
  protected remotePeripherals: BleRemotePeripheral[];

  constructor(obniz: Obniz) {
    super(obniz);
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

    this.on("/response/ble/hci/read", (obj) => {
      if (obj.hci) {
        this.hci.notified(obj.hci);
      }
    });

    this._bind();
    this._reset();
  }

  /**
   * Initialize BLE module. You need call this first everything before.
   *
   * ```javascript
   * // Javascript Example
   * await obniz.ble.initWait();
   * ```
   */
  public async initWait(): Promise<void> {
    if (!this._initialized) {
      this._initialized = true;

      // force initialize on obnizOS < 3.2.0
      if (semver.lt(this.Obniz.firmware_ver!, "3.2.0")) {
        this.hci.init();
        this.hci.end(); // disable once
        this.hci.init();
      }

      await this.hciProtocol.initWait();
    }
  }

  /**
   * @ignore
   * @private
   */
  public _reset() {}

  /**
   * Connect to peripheral without scanning.
   * Returns a peripheral instance, but the advertisement information such as localName is null because it has not been scanned.
   *
   * ```javascript
   * // Javascript Example
   *
   * await obniz.ble.initWait();
   * var peripheral = obniz.ble.directConnect("e4b9efb29218","random");
   * peripheral.onconnect = ()=>{
   *   console.log("connected");
   * }
   * ```
   *
   * @param uuid peripheral device address
   * @param addressType "random" or "public"
   */
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

  /**
   * Connect to peripheral without scanning, and wait to finish connecting.
   *
   * It throws when connection establish failed.
   * Returns a peripheral instance, but the advertisement information such as localName is null because it has not been scanned.
   *
   * ```javascript
   * // Javascript Example
   * await obniz.ble.initWait();
   * try {
   *   var peripheral = await obniz.ble.directConnectWait("e4b9efb29218","random");
   *   console.log("connected");
   * } catch(e) {
   *   console.log("can't connect");
   * }
   * ```
   *
   * @param address peripheral device address
   * @param addressType "random" or "public"
   */
  public async directConnectWait(address: BleDeviceAddress, addressType: BleDeviceAddressType) {
    const peripheral: any = this.directConnect(address, addressType);
    await peripheral.connectWait();
    return peripheral;
  }

  /**
   * @ignore
   */
  public warningIfNotInitialize() {
    if (!this._initialized && this._initializeWarning) {
      this._initializeWarning = true;
      this.Obniz.warning({
        alert: "warning",
        message: `BLE is not initialized. Please call 'await obniz.ble.initWait()'`,
      });
    }
  }

  public schemaBasePath(): string {
    return "ble";
  }

  protected onStateChange() {}

  protected findPeripheral(address: BleDeviceAddress) {
    for (const key in this.remotePeripherals) {
      if (this.remotePeripherals[key].address === address) {
        return this.remotePeripherals[key];
      }
    }
    return null;
  }

  protected onDiscover(
    uuid: any,
    address?: any,
    addressType?: any,
    connectable?: any,
    advertisement?: any,
    rssi?: any,
  ) {
    let val: any = this.findPeripheral(uuid);
    if (!val) {
      val = new BleRemotePeripheral(this, uuid);
      this.remotePeripherals.push(val);
    }
    val.discoverdOnRemote = true;

    const peripheralData: any = {
      device_type: "ble",
      address_type: addressType,
      ble_event_type: connectable ? "connectable_advertisemnt" : "non_connectable_advertising",
      rssi,
      adv_data: advertisement.advertisementRaw,
      scan_resp: advertisement.scanResponseRaw,
    };

    val.setParams(peripheralData);
    val._adv_data_filtered = advertisement;

    this.scan.notifyFromServer("onfind", val);
  }

  protected async onConnect(peripheralUuid: any, error?: any) {
    const peripheral: any = this.findPeripheral(peripheralUuid);
    // if (!error && peripheral._connectSetting.autoDiscovery) {
    //   await peripheral.discoverAllHandlesWait();
    // }
    peripheral.notifyFromServer("statusupdate", {
      status: error ? "disconnected" : "connected",
    });
  }

  protected onDisconnect(peripheralUuid: any) {
    const peripheral: any = this.findPeripheral(peripheralUuid);
    peripheral.notifyFromServer("statusupdate", { status: "disconnected" });
  }

  protected onServicesDiscover(peripheralUuid: any, serviceUuids?: any) {
    const peripheral: any = this.findPeripheral(peripheralUuid);
    for (const serviceUuid of serviceUuids) {
      peripheral.notifyFromServer("discover", { service_uuid: serviceUuid });
    }
    peripheral.notifyFromServer("discoverfinished", {});
  }

  protected onIncludedServicesDiscover(peripheralUuid: any, serviceUuid?: any, includedServiceUuids?: any) {}

  protected onCharacteristicsDiscover(peripheralUuid: any, serviceUuid?: any, characteristics?: any) {
    const peripheral: any = this.findPeripheral(peripheralUuid);
    const service: any = peripheral.findService({ service_uuid: serviceUuid });
    for (const char of characteristics) {
      const obj: any = {
        properties: char.properties.map((e: any) => BleHelper.toSnakeCase(e)),
        characteristic_uuid: char.uuid,
      };
      service.notifyFromServer("discover", obj);
    }
    service.notifyFromServer("discoverfinished", {});
  }

  protected onRead(
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

  protected onWrite(peripheralUuid: any, serviceUuid?: any, characteristicUuid?: any, isSuccess?: any) {
    const peripheral: any = this.findPeripheral(peripheralUuid);
    const characteristic: any = peripheral.findCharacteristic({
      service_uuid: serviceUuid,
      characteristic_uuid: characteristicUuid,
    });
    characteristic.notifyFromServer("onwrite", {
      result: isSuccess ? "success" : "failed",
    });
  }

  protected onBroadcast(peripheralUuid: any, serviceUuid?: any, characteristicUuid?: any, state?: any) {}

  protected onNotify(peripheralUuid: any, serviceUuid?: any, characteristicUuid?: any, state?: any) {
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

  protected onDescriptorsDiscover(peripheralUuid: any, serviceUuid?: any, characteristicUuid?: any, descriptors?: any) {
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

  protected onValueRead(
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

  protected onValueWrite(
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

  protected onPeripheralStateChange(state: any) {
    // console.error("onPeripheralStateChange")
  }

  protected onPeripheralAccept(clientAddress: any) {
    this.peripheral.currentConnectedDeviceAddress = clientAddress;
    if (this.peripheral.onconnectionupdates) {
      this.peripheral.onconnectionupdates({
        address: clientAddress,
        status: "connected",
      });
    }
  }

  protected onPeripheralMtuChange(mtu: any) {
    // console.error("onPeripheralMtuChange")
  }

  protected onPeripheralDisconnect(clientAddress: any) {
    this.peripheral.currentConnectedDeviceAddress = null;
    if (this.peripheral.onconnectionupdates) {
      this.peripheral.onconnectionupdates({
        address: clientAddress,
        status: "disconnected",
      });
    }
  }

  protected _bind() {
    this.centralBindings.on("stateChange", this.onStateChange.bind(this));

    this.centralBindings.on("discover", this.onDiscover.bind(this));
    this.centralBindings.on("connect", this.onConnect.bind(this));
    this.centralBindings.on("disconnect", this.onDisconnect.bind(this));
    this.centralBindings.on("servicesDiscover", this.onServicesDiscover.bind(this));
    this.centralBindings.on("includedServicesDiscover", this.onIncludedServicesDiscover.bind(this));
    this.centralBindings.on("characteristicsDiscover", this.onCharacteristicsDiscover.bind(this));

    this.centralBindings.on("read", this.onRead.bind(this));
    this.centralBindings.on("write", this.onWrite.bind(this));
    this.centralBindings.on("broadcast", this.onBroadcast.bind(this));
    this.centralBindings.on("notify", this.onNotify.bind(this));
    this.centralBindings.on("descriptorsDiscover", this.onDescriptorsDiscover.bind(this));
    this.centralBindings.on("valueRead", this.onValueRead.bind(this));
    this.centralBindings.on("valueWrite", this.onValueWrite.bind(this));

    this.peripheralBindings.on("stateChange", this.onPeripheralStateChange.bind(this));
    this.peripheralBindings.on("accept", this.onPeripheralAccept.bind(this));
    this.peripheralBindings.on("mtuChange", this.onPeripheralMtuChange.bind(this));
    this.peripheralBindings.on("disconnect", this.onPeripheralDisconnect.bind(this));
  }
}
