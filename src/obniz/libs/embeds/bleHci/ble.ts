/**
 * Obniz BLE are switches automatically. <br/>
 * obnizOS ver >= 3.0.0  : [[ObnizCore.Components.Ble.Hci | Hci]] <br/>
 * obnizOS ver < 3.0.0   : Not Supported <br/>
 *
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */

import { ObnizBLEHci } from './hci';
import { NobleBindings as CentralBindings } from './protocol/central/bindings';
import { Hci as HciProtocol } from './protocol/hci';
import { BlenoBindings as PeripheralBindings } from './protocol/peripheral/bindings';

import semver from 'semver';
import Obniz from '../../../index';
import {
  ObnizBleHciStateError,
  ObnizBleUnsupportedHciError,
  ObnizBleUnSupportedOSVersionError,
  ObnizOfflineError,
} from '../../../ObnizError';
import { ComponentAbstract } from '../../ComponentAbstact';
import { BleAdvertisement } from './bleAdvertisement';
import { BleCharacteristic } from './bleCharacteristic';
import { BleDescriptor } from './bleDescriptor';
import { BlePeripheral } from './blePeripheral';
import { BleConnectSetting, BleRemotePeripheral } from './bleRemotePeripheral';
import { BleScan } from './bleScan';
import { BleService } from './bleService';
import {
  BleDeviceAddress,
  BleDeviceAddressType,
  BleDiscoveryAdvertisement,
  BleSupportType,
  UUID,
} from './bleTypes';
import { BleExtendedAdvertisement } from './bleExtendedAdvertisement';

/**
 * Use a obniz device as a BLE device.
 * Peripheral and Central mode are supported
 */
export class ObnizBLE extends ComponentAbstract {
  // public security!: BleSecurity;

  /**
   * Initialized status.
   *
   * ```javascript
   * // Javascript Example
   * obniz.ble.isInitialized; // => false
   * await obniz.ble.initWait();
   * obniz.ble.isInitialized; // => true
   * ```
   */
  public get isInitialized() {
    return this._initialized;
  }

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
      uuid.push(('00' + data[i].toString(16).toLowerCase()).slice(-2));
    }
    if (reverse) {
      uuid = uuid.reverse();
    }
    let str: any = uuid.join('');
    if (uuid.length >= 16) {
      str =
        str.slice(0, 8) +
        '-' +
        str.slice(8, 12) +
        '-' +
        str.slice(12, 16) +
        '-' +
        str.slice(16, 20) +
        '-' +
        str.slice(20);
    }
    return str;
  }

  public hci: ObnizBLEHci;
  public peripheral!: BlePeripheral;
  public scan!: BleScan;

  /**
   * @ignore
   */
  public centralBindings!: CentralBindings;

  /**
   * @ignore
   */
  public peripheralBindings!: PeripheralBindings;
  public service: typeof BleService;
  public characteristic: typeof BleCharacteristic;
  public descriptor: typeof BleDescriptor;

  /**
   * @ignore
   */
  public advertisement!: BleAdvertisement;
  public extendedAdvertisement?: BleExtendedAdvertisement;
  protected hciProtocol!: HciProtocol;
  protected _initializeWarning!: boolean;
  protected remotePeripherals: Record<
    BleDeviceAddress,
    BleRemotePeripheral
  > = {};

  /**
   * This is a callback function used when an external device gets connected or disconnected.
   *
   * ```javascript
   * await obniz.ble.initWait();
   * obniz.ble.onUpdatePhy = ((txPhy, rxPhy) => {
   *    console.log("txPhy "+txPhy+" rxPhy "+rxPhy);
   * });
   * ```
   *
   */
  public onUpdatePhy?: (
    txPhy: '1m' | '2m' | 'coded',
    rxPhy: '1m' | '2m' | 'coded',
    handler?: number
  ) => void;

  /**
   * @ignore
   */
  private _initialized = false;

  constructor(obniz: Obniz, info: any) {
    super(obniz);
    const extended = info.extended;
    this.hci = new ObnizBLEHci(obniz, extended);
    this.service = BleService;
    this.characteristic = BleCharacteristic;
    this.descriptor = BleDescriptor;
    // this.on("/response/ble/hci/read", (obj) => {
    //   if (obj.hci) {
    //     this.hci.notified(obj.hci);
    //   }
    // });

    // this.on("/response/ble/error", (obj) => {
    //   if (obj.error) {
    //     const error = obj.error;
    //     let msg = "BLE error: " + error.message;
    //     msg += " (";
    //     msg += "error_code: " + error.error_code;
    //     msg += ", ";
    //     msg += "module_error_code: " + error.module_error_code;
    //     msg += ", ";
    //     msg += "function_code: " + error.function_code;
    //     msg += ", ";
    //     msg += "address: " + error.address;
    //     msg += ", ";
    //     msg += "service_uuid: " + error.service_uuid;
    //     msg += ", ";
    //     msg += "characteristic_uuid: " + error.characteristic_uuid;
    //     msg += ", ";
    //     msg += "descriptor_uuid: " + error.descriptor_uuid;
    //     msg += ")";
    //
    //     this.Obniz.error({ alert: "error", message: msg });
    //   }
    // });

    this._reset();
  }

  public notifyFromObniz(json: any) {
    if (json.hci) {
      this.hci.notified(json.hci);
    }

    if (json.error) {
      const error = json.error;
      let msg = 'BLE error: ' + error.message;
      msg += ' (';
      msg += 'error_code: ' + error.error_code;
      msg += ', ';
      msg += 'module_error_code: ' + error.module_error_code;
      msg += ', ';
      msg += 'function_code: ' + error.function_code;
      msg += ', ';
      msg += 'address: ' + error.address;
      msg += ', ';
      msg += 'service_uuid: ' + error.service_uuid;
      msg += ', ';
      msg += 'characteristic_uuid: ' + error.characteristic_uuid;
      msg += ', ';
      msg += 'descriptor_uuid: ' + error.descriptor_uuid;
      msg += ')';

      this.Obniz.error({ alert: 'error', message: msg });
    }
  }

  /**
   * ESP32 C3 or ESP32 S3 only
   *
   * Sets the PHY to use by default
   *
   * ```javascript
   * // Javascript Example
   * await obniz.ble.setDefaultPhyWait(false,false,true);//coded only
   * ```
   */
  public async setDefaultPhyWait(
    usePhy1m: boolean,
    usePhy2m: boolean,
    usePhyCoded: boolean
  ) {
    await this.centralBindings.setDefaultPhyWait(
      usePhy1m,
      usePhy2m,
      usePhyCoded
    );
  }

  protected _onUpdatePhy(handler: number, txPhy: number, rxPhy: number) {
    if (this.onUpdatePhy) {
      this.onUpdatePhy(this.phyToStr(txPhy), this.phyToStr(rxPhy), handler);
    }
  }

  // eslint-disable-next-line
  public debugHandler = (text: string): void => {};

  /**
   * Initialize BLE module. You need call this first everything before.
   * This throws if device is not supported device.
   *
   * esp32 C3 or esp32 S3 Put true in the argument
   * when not using the BLE5.0 extended advertise
   *
   * ```javascript
   * // Javascript Example
   * await obniz.ble.initWait();
   * ```
   */
  public async initWait(supportType: BleSupportType = {}): Promise<void> {
    if (
      this.hci._extended &&
      supportType &&
      typeof supportType.extended === 'boolean'
    ) {
      this.hci._extended = supportType.extended;
      this._reset(true);
    }
    if (!this._initialized) {
      const MinHCIAvailableOS = '3.0.0';
      if (semver.lt(this.Obniz.firmware_ver!, MinHCIAvailableOS)) {
        throw new ObnizBleUnSupportedOSVersionError(
          this.Obniz.firmware_ver!,
          MinHCIAvailableOS
        );
      }

      // force initialize on obnizOS < 3.2.0
      if (semver.lt(semver.coerce(this.Obniz.firmware_ver!)!, '3.2.0')) {
        this.hci.init();
        this.hci.end(); // disable once
        this.hci.init();
      }

      try {
        await this.hciProtocol.initWait();
      } catch (e) {
        if (e instanceof ObnizBleUnsupportedHciError) {
          this.Obniz.reboot();
        }
        throw e;
      }

      this._initialized = true;
    }
  }

  /**
   * Reset Target Device and current SDK status without rebooting. If error occured while reset, then target device will reboot.
   *
   * ```javascript
   * // Javascript Example
   * await obniz.ble.resetWait();
   * ```
   */
  public async resetWait(): Promise<void> {
    try {
      if (this._initialized) {
        this._reset();
        await this.hciProtocol.resetWait();
        this._initialized = true;
      }
    } catch (e) {
      if (e instanceof ObnizBleUnsupportedHciError) {
        this.Obniz.reboot();
      }
      throw e;
    }
  }

  /**
   * @ignore
   * @private
   */
  public _reset(keepExtended = false) {
    // reset state at first
    this._initialized = false;
    this._initializeWarning = true;

    // clear all found peripherals.
    Object.values(this.remotePeripherals)
      .filter((p) => p.connected)
      .forEach((p) =>
        p.notifyFromServer('statusupdate', {
          status: 'disconnected',
          reason: new ObnizOfflineError(),
        })
      );
    // this.remotePeripherals = {};

    // instantiate
    if (!this.peripheral) {
      this.peripheral = new BlePeripheral(this);
    }
    if (!this.scan) {
      this.scan = new BleScan(this);
    } else {
      this.scan.notifyFromServer('obnizClose', {});
    }
    if (!this.advertisement) {
      this.advertisement = new BleAdvertisement(this);
    }
    if (!this.extendedAdvertisement && this.hci._extended) {
      this.extendedAdvertisement = new BleExtendedAdvertisement(this);
    }
    if (!this.hci._extended) {
      this.extendedAdvertisement = undefined;
    }

    // reset all submodules.
    this.peripheral._reset();
    this.scan._reset();
    this.advertisement._reset();
    if (this.extendedAdvertisement) {
      this.extendedAdvertisement._reset();
    }

    // clear scanning
    this.hci._reset(keepExtended);
    if (!this.hciProtocol) {
      this.hciProtocol = new HciProtocol(this.hci);
      this.hciProtocol.debugHandler = (text: any) => {
        this.debug(`BLE-HCI: ${text}`);
      };
    } else {
      this.hciProtocol._reset();
    }
    if (!this.centralBindings) {
      this.centralBindings = new CentralBindings(this.hciProtocol);
      this.centralBindings.debugHandler = (text: any) => {
        this.debug(`BLE: ${text}`);
      };
      this.centralBindings.on('stateChange', this.onStateChange.bind(this));
      this.centralBindings.on('discover', this.onDiscover.bind(this));
      this.centralBindings.on('disconnect', this.onDisconnect.bind(this));
      this.centralBindings.on('notification', this.onNotification.bind(this));
      this.centralBindings.on('updatePhy', this._onUpdatePhy.bind(this));
    } else {
      this.centralBindings._reset();
    }
    if (!this.peripheralBindings) {
      this.peripheralBindings = new PeripheralBindings(this.hciProtocol);
      this.peripheralBindings.on(
        'stateChange',
        this.onPeripheralStateChange.bind(this)
      );
      this.peripheralBindings.on('accept', this.onPeripheralAccept.bind(this));
      this.peripheralBindings.on(
        'mtuChange',
        this.onPeripheralMtuChange.bind(this)
      );
      this.peripheralBindings.on(
        'disconnect',
        this.onPeripheralDisconnect.bind(this)
      );
    } else {
      this.peripheralBindings._reset();
    }
  }

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
   * @param address peripheral device address
   * @param addressType "random" or "public"
   *
   * @deprecated replaced by {@link #directConnectWait()}
   */
  public directConnect(
    address: BleDeviceAddress,
    addressType: BleDeviceAddressType,
    connectionSetting?: BleConnectSetting
  ) {
    // noinspection JSIgnoredPromiseFromCall
    this.directConnectWait(address, addressType, connectionSetting).catch(
      (e) => {
        // background
        this.Obniz.error(e);
      }
    );
    return this.remotePeripherals[address];
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
  public async directConnectWait(
    address: BleDeviceAddress,
    addressType: BleDeviceAddressType,
    connectionSetting?: BleConnectSetting
  ) {
    const peripheral = new BleRemotePeripheral(this, address, addressType);
    this.remotePeripherals[address] = peripheral;
    await peripheral.connectWait(connectionSetting);
    return peripheral;
  }

  /**
   * Return connected peripherals.
   *
   * ```javascript
   * // Javascript Example
   * await obniz.ble.initWait();
   * let target = {
   *   localName: "Blank"
   * };
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   * if(peripheral) {
   *   try {
   *     await peripheral.connectWait();
   *   } catch(e) {
   *     console.error(e);
   *   }
   * }
   * console.log(obniz.ble.getConnectedPeripherals());
   * ```
   *
   * @returns connected peripherals
   */
  public getConnectedPeripherals(): BleRemotePeripheral[] {
    return Object.values(this.remotePeripherals).filter((p) => p.connected);
  }

  /**
   * @ignore
   */
  public warningIfNotInitialize() {
    if (this.Obniz.connectionState !== 'connected') {
      throw new ObnizOfflineError();
    }
    if (!this._initialized && this._initializeWarning) {
      this._initializeWarning = true;
      this.Obniz.warning({
        alert: 'warning',
        message: `BLE is not initialized. Please call 'await obniz.ble.initWait()'`,
      });
    }
  }

  public schemaBasePath(): string {
    return 'ble';
  }

  /**
   * @ignore
   */
  // public addConnectedPeripheral(peripheral: BleRemotePeripheral): void {
  //   this.connectedPeripherals[peripheral.address] = peripheral;
  // }

  protected onStateChange() {
    // do nothing.
  }

  protected onDiscover(
    address: BleDeviceAddress,
    addressType: BleDeviceAddressType,
    connectable: boolean,
    advertisement: BleDiscoveryAdvertisement,
    rssi: number
  ): void {
    const val = Object.keys(this.remotePeripherals).includes(address)
      ? this.remotePeripherals[address]
      : new BleRemotePeripheral(this, address, addressType);
    val.discoverdOnRemote = true;

    const peripheralData = {
      device_type: 'ble',
      ble_event_type: connectable
        ? 'connectable_advertisemnt'
        : 'non_connectable_advertising',
      rssi,
      adv_data: advertisement.advertisementRaw,
      scan_resp: advertisement.scanResponseRaw,
      service_data: advertisement.serviceData,
    };

    val.setParams(peripheralData);
    val.setExtendFlg(this.hci._extended);
    this.scan.notifyFromServer('onfind', val);
  }

  protected onDisconnect(
    address: BleDeviceAddress,
    reason: ObnizBleHciStateError
  ): void {
    const peripheral = this.remotePeripherals[address];
    peripheral.notifyFromServer('statusupdate', {
      status: 'disconnected',
      reason,
    });
    // delete this.connectedPeripherals[address];
  }

  //
  // protected onServicesDiscover(peripheralUuid: any, serviceUuids?: any) {
  //   const peripheral: any = this.findPeripheral(peripheralUuid);
  //   for (const serviceUuid of serviceUuids) {
  //     peripheral.notifyFromServer("discover", { service_uuid: serviceUuid });
  //   }
  //   peripheral.notifyFromServer("discoverfinished", {});
  // }

  // protected onIncludedServicesDiscover(peripheralUuid: any, serviceUuid?: any, includedServiceUuids?: any) {}

  // protected onCharacteristicsDiscover(peripheralUuid: any, serviceUuid?: any, characteristics?: any) {
  //   const peripheral: any = this.findPeripheral(peripheralUuid);
  //   const service: any = peripheral.findService({ service_uuid: serviceUuid });
  //   for (const char of characteristics) {
  //     const obj: any = {
  //       properties: char.properties.map((e: any) => BleHelper.toSnakeCase(e)),
  //       characteristic_uuid: char.uuid,
  //     };
  //     service.notifyFromServer("discover", obj);
  //   }
  //   service.notifyFromServer("discoverfinished", {});
  // }

  protected onNotification(
    address: BleDeviceAddress,
    serviceUuid: UUID,
    characteristicUuid: UUID,
    data: Buffer,
    isNotification: boolean,
    isSuccess: boolean
  ): void {
    const peripheral = this.remotePeripherals[address];
    const characteristic = peripheral.findCharacteristic({
      service_uuid: serviceUuid,
      characteristic_uuid: characteristicUuid,
    });

    if (characteristic && isNotification) {
      const obj = {
        data: Array.from(data),
      };
      characteristic.notifyFromServer('onnotify', obj);
    }
  }

  protected onPeripheralStateChange(state: any) {
    // console.error("onPeripheralStateChange")
  }

  protected onPeripheralAccept(clientAddress: any) {
    this.peripheral.currentConnectedDeviceAddress = clientAddress;
    if (this.peripheral.onconnectionupdates) {
      this.peripheral.onconnectionupdates({
        address: clientAddress,
        status: 'connected',
      });
    }
  }

  protected onPeripheralMtuChange(mtu: any) {
    // console.error("onPeripheralMtuChange")
  }

  protected onPeripheralDisconnect(clientAddress: any, reason: any) {
    this.peripheral.currentConnectedDeviceAddress = null;
    if (this.peripheral.onconnectionupdates) {
      this.peripheral.onconnectionupdates({
        address: clientAddress,
        status: 'disconnected',
        reason,
      });
    }
  }

  private debug(text: string) {
    this.debugHandler(text);
  }

  private phyToStr(phy: number) {
    switch (phy) {
      case 1:
        return '1m';
      case 2:
        return '2m';
      case 3:
        return 'coded';
      default:
        throw new Error('decode Phy Error');
    }
  }
}
