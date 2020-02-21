/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import EventEmitter from "eventemitter3";
import semver from "semver";
import Util from "../../utils/util";
import {ObnizOldBLE} from "../ble";
import ObnizBLE from "./ble";
import BleHelper from "./bleHelper";
import BlePeripheral from "./blePeripheral";
import BleRemotePeripheral from "./bleRemotePeripheral";
import {BleDeviceAddress, UUID} from "./bleTypes";
import ObnizBLEHci from "./hci";

export type BleScanMode = "passive" | "active";
export type BleBinary = number[];

/**
 * All parameters are OR. If you set uuid and localName, obniz find uuid match but localName not match device.
 *
 * If obnizOS >= 3.2.0, filters are apply on obniz device. So it reduce traffic.
 */
export interface BleScanTarget {
  uuids?: UUID[];
  /**
   * scan target device localName. This need perfect matching.
   */
  localName?: string[] | string;

  /**
   * scan target device localName. This need prefix matching.
   */
  localNamePrefix?: string | string[];

  /**
   * device address
   */
  deviceAddress?: BleDeviceAddress[] | BleDeviceAddress;

  /**
   * Advanced search.
   *
   * Search partially matches advertisement / scan response
   */
  binary?: BleBinary[] | BleBinary;

}

/**
 * @ignore
 */
export interface BleScanAdvertisementFilterParam {
  deviceAddress?: BleDeviceAddress;
  localNamePrefix?: string;
  uuid?: UUID;
  binary?: number[];
}

export interface BleScanSetting {
  /**
   * Timeout seconds of scanning. Default is 30 seconds.
   *
   * If set null, scan don't stop automatically.
   */
  duration?: number | null;

  /**
   * (obnizOS 3 or later only)
   * Specifying onfind will be called or not when an advertisement received from already known peripheral. Default is false : never called again.
   */
  duplicate?: boolean;

  /**
   * (obnizOS 3 or later only)
   * Active scan or Passive Scan
   * Default is true : activeScan.
   *
   */
  activeScan?: boolean;
}

/**
 * @category Use as Central
 */
export default class BleScan {

  /**
   * This function gets called when obniz Board finishes scanning.
   *
   * ```javascript
   * // Javascript Example
   *
   * obniz.ble.scan.onfind = function(peripheral){
   *   console.log(peripheral)
   * };
   *
   * obniz.ble.scan.onfinish = function(peripherals){
   *    console.log("scan timeout!")
   * };
   *
   * await obniz.ble.initWait();
   * obniz.ble.scan.start();
   * ```
   *
   */
  public onfinish?: (peripherals: BleRemotePeripheral[]) => void;

  /**
   * This function gets called when obniz Board finds a new peripheral.
   *
   * ```javascript
   * // Javascript Example
   *
   * obniz.ble.scan.onfind = function(peripheral){
   *  console.log(peripheral)
   * };
   *
   * await obniz.ble.initWait();
   * obniz.ble.scan.start();
   * ```
   */
  public onfind?: (peripheral: BleRemotePeripheral) => void;
  protected scanTarget: BleScanTarget;
  protected scanSettings: BleScanSetting;
  protected obnizBle: ObnizBLE;
  protected emitter: EventEmitter;
  protected scanedPeripherals: BleRemotePeripheral[];
  private _timeoutTimer?: NodeJS.Timeout;

  constructor(obnizBle: ObnizBLE) {
    this.scanTarget = {};
    this.scanSettings = {};
    this.obnizBle = obnizBle;
    this.emitter = new EventEmitter();

    this.scanedPeripherals = [];
    this._timeoutTimer = undefined;
  }

  /**
   * This starts scanning BLE.
   *
   * You can filter uuids or localName using the target param.
   *
   * ```javascript
   * // Javascript Example
   * var target = {
   *     uuids: ["fff0","FFF1"],     //scan only has uuids "fff0" and "FFF1"
   *     localName: "obniz-BLE",     //scan only has localName "obniz-BLE"
   * };
   *
   * var setting = {
   *    duration : 10  //scan duration time in seconds. default is 30 sec.
   * }
   *
   * await obniz.ble.initWait();
   * obniz.ble.scan.start(target, setting);
   * ```
   *
   * This is also possible without params being valid.
   *
   * ```javascript
   * // Javascript Example
   * obniz.ble.scan.start();
   * ```
   *
   * @param target
   * @param settings
   */
  public start(target: BleScanTarget = {}, settings: BleScanSetting = {}) {
    this.obnizBle.warningIfNotInitialize();

    const timeout: number | null = settings.duration === undefined ? 30 : settings.duration;
    settings.duplicate = !!settings.duplicate;
    settings.activeScan = settings.activeScan !== false;
    this.scanSettings = settings;

    this.scanTarget = target;
    if (this.scanTarget.uuids) {
      this.scanTarget.uuids = this.scanTarget.uuids.map((elm: UUID) => {
        return BleHelper.uuidFilter(elm);
      });
    }
    this.scanedPeripherals = [];

    this._setTargetFilterOnDevice();

    this.obnizBle.centralBindings.startScanning(null, false, settings.activeScan);

    this.clearTimeoutTimer();
    if (timeout !== null) {
      this._timeoutTimer = setTimeout(() => {
        this._timeoutTimer = undefined;
        this.end();
      }, timeout * 1000);
    }
  }

  /**
   * This scans and returns the first peripheral that was found among the objects specified in the target.
   *
   * ```javascript
   * // Javascript Example
   *
   * await obniz.ble.initWait();
   * var target = {
   *   uuids: ["fff0"],
   * };
   *
   * var peripheral = await obniz.ble.scan.startOneWait(target);
   * console.log(peripheral);
   * ```
   *
   * @param target
   * @param settings
   */
  public startOneWait(target: BleScanTarget, settings: BleScanSetting): Promise<BlePeripheral> {
    let state: any = 0;

    return new Promise((resolve: any) => {
      this.emitter.once("onfind", (param: any) => {
        if (state === 0) {
          state = 1;
          this.end();
          resolve(param);
        }
      });

      this.emitter.once("onfinish", () => {
        if (state === 0) {
          state = 1;
          resolve(null);
        }
      });

      this.start(target, settings);
    });
  }

  /**
   * This scans and returns all the peripherals found.
   *
   * This function does not return until scanning gets timed out.(default 30sec)
   * If you want to change the default duration, you can do so with the duration param.
   *
   * ```javascript
   * // Javascript Example
   *
   * await obniz.ble.initWait();
   * var target = {
   *  uuids: ["fff0"],
   * };
   * var setting = {
   *   duration : 10
   * }
   *
   * var peripherals = await obniz.ble.scan.startAllWait(target,setting);
   *
   * for(var peripheral of peripherals){
   *   console.log(peripheral);
   * }
   * ```
   *
   * @param target
   * @param settings
   */
  public startAllWait(target: BleScanTarget, settings: BleScanSetting): Promise<BlePeripheral[]> {
    return new Promise((resolve: any) => {
      this.emitter.once("onfinish", () => {
        resolve(this.scanedPeripherals);
      });

      this.start(target, settings);
    });
  }

  /**
   * This stops scanning BLE.
   *
   * ```javascript
   * // Javascript Example
   * await obniz.ble.initWait();
   * obniz.ble.scan.start();
   * await obniz.wait(5000);
   * obniz.ble.scan.end();
   * ```
   */
  public end() {
    this.clearTimeoutTimer();
    this.obnizBle.centralBindings.stopScanning();
  }

  /**
   * @ignore
   * @param notifyName
   * @param params
   */
  public notifyFromServer(notifyName: string, params: any) {
    switch (notifyName) {
      case "onfind": {
        if (this.scanSettings.duplicate === false) {
          // duplicate filter
          if (this.scanedPeripherals.find((e: any) => e.address === params.address)) {
            break;
          }
        }
        if (this.isTarget(params)) {
          this.scanedPeripherals.push(params);
          this.emitter.emit(notifyName, params);
          if (this.onfind) {
            this.onfind(params);
          }
        }
        break;
      }
      case "onfinish": {
        this.clearTimeoutTimer();
        this.emitter.emit(notifyName, this.scanedPeripherals);
        if (this.onfinish) {
          this.onfinish(this.scanedPeripherals);
        }
        break;
      }
    }
  }

  /**
   * Clear advertisement filter.
   */
  public clearAdvertisementFilter() {
    this.obnizBle.Obniz.send({
      ble: {
        hci: {
          advertisement_filter: [],
        },
      },
    });
  }

  protected _setAdvertisementFilter(filterVals: BleScanAdvertisementFilterParam[]) {

    // < 3.2.0
    if (semver.lt(this.obnizBle.Obniz.firmware_ver!, "3.2.0")) {
      return;
    }

    // #define BLE_AD_REPORT_DEVICE_ADDRESS_INDEX 2
    // #define BLE_AD_REPORT_ADVERTISMENT_INDEX 9

    const filters: any = [];
    filterVals.forEach((filterVal: BleScanAdvertisementFilterParam) => {

      if (filterVal.localNamePrefix) {
        filters.push({
          range: {
            index: 9,
            length: 255,
          },
          value: [0x08, ...Util.string2dataArray(filterVal.localNamePrefix)],
        });
        filters.push
        ({
          range: {
            index: 9,
            length: 255,
          },
          value: [0x09, ...Util.string2dataArray(filterVal.localNamePrefix)],
        });
      }

      if (filterVal.deviceAddress) {
        filters.push({
          range: {
            index: 2,
            length: 6,
          },
          value: Util.hexToBinary(filterVal.deviceAddress, true),
        });
      }

      if (filterVal.uuid) {
        const binary = Util.hexToBinary(filterVal.uuid, true);

        filters.push({
          range: {
            index: 9,
            length: 255,
          },
          value: binary,
        });

      }

      if (filterVal.binary) {
        filters.push({
          range: {
            index: 0,
            length: 255,
          },
          value: filterVal.binary,
        });
      }
    });

    this.obnizBle.Obniz.send({
      ble: {
        hci: {
          advertisement_filter: filters,
        },
      },
    });
  }

  protected _arrayWrapper<T>(val: T | T[]): T[] {
    if (Array.isArray(val)) {
      return val;
    } else {
      return [val];
    }
  }

  protected _setTargetFilterOnDevice() {

    // < 3.2.0
    if (semver.lt(this.obnizBle.Obniz.firmware_ver!, "3.2.0")) {
      return;
    }

    const adFilters: BleScanAdvertisementFilterParam[] = [];
    if (this.scanTarget.uuids) {
      this.scanTarget.uuids.map((elm: UUID) => {
        adFilters.push({uuid: BleHelper.uuidFilter(elm)});
      });
    }
    if (this.scanTarget.localName) {
      this._arrayWrapper(this.scanTarget.localName).forEach((name) => {
        adFilters.push({localNamePrefix: name});
      });
    }
    if (this.scanTarget.deviceAddress) {
      this._arrayWrapper(this.scanTarget.deviceAddress).forEach((address) => {
        adFilters.push({deviceAddress: address});
      });
    }

    if (this.scanTarget.localNamePrefix) {
      this._arrayWrapper(this.scanTarget.localNamePrefix).forEach((name) => {
        adFilters.push({localNamePrefix: name});
      });
    }
    if (this.scanTarget.binary) {
      if (Array.isArray(this.scanTarget.binary[0])) {
        this.scanTarget.binary.forEach((e: any) => {
          adFilters.push({binary: e});
        });
      } else {
        adFilters.push({binary: this.scanTarget.binary as number[]});
      }
    }
    this._setAdvertisementFilter(adFilters);
  }

  protected isTarget(peripheral: BleRemotePeripheral) {

    if (
      Object.keys(this.scanTarget).length === 0
      || this.isLocalNamePrefixTarget(peripheral)
      || this.isLocalNameTarget(peripheral)
      || this.isUuidTarget(peripheral)
      || this.isDeviceAddressTarget(peripheral)
      || this.isBinaryTarget(peripheral)
    ) {
      return true;
    }

    return false;
  }

  protected clearTimeoutTimer() {
    if (this._timeoutTimer) {
      clearTimeout(this._timeoutTimer);
      this._timeoutTimer = undefined;
    }
  }

  private isLocalNameTarget(peripheral: BleRemotePeripheral) {
    if (
      this.scanTarget &&
      this.scanTarget.localName) {
      for (const name of this._arrayWrapper(this.scanTarget.localName)) {
        if (name === peripheral.localName) {
          return true;
        }
      }
    }

    return false;
  }

  private isLocalNamePrefixTarget(peripheral: BleRemotePeripheral) {
    if (
      this.scanTarget &&
      this.scanTarget.localNamePrefix) {
      for (const name of this._arrayWrapper(this.scanTarget.localNamePrefix)) {
        if (peripheral.localName && peripheral.localName.startsWith(name)) {
          return true;
        }
      }
    }

    return false;
  }

  private isBinaryTarget(peripheral: BleRemotePeripheral) {
    if (
      this.scanTarget &&
      this.scanTarget.binary) {
      return true; // cannot detect on obnizjs
    }

    return false;
  }

  private isUuidTarget(peripheral: BleRemotePeripheral) {
    if (this.scanTarget && this.scanTarget.uuids) {
      const uuids: any = peripheral.advertisementServiceUuids().map((e: any) => {
        return BleHelper.uuidFilter(e);
      });
      for (const uuid of this.scanTarget.uuids) {
        if (uuids.includes(uuid)) {
          return true;
        }
      }
    }

    return false;
  }

  private isDeviceAddressTarget(peripheral: BleRemotePeripheral) {
    if (this.scanTarget && this.scanTarget.deviceAddress) {
      if (this.scanTarget.deviceAddress === peripheral.address) {
        return true;
      }
    }
    return false;
  }

}
