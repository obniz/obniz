/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import EventEmitter from "eventemitter3";
import semver from "semver";
import Util from "../../utils/util";
import { ObnizOldBLE } from "../ble";
import ObnizBLE from "./ble";
import BleHelper from "./bleHelper";
import BlePeripheral from "./blePeripheral";
import BleRemotePeripheral from "./bleRemotePeripheral";
import { BleDeviceAddress, UUID } from "./bleTypes";
import ObnizBLEHci from "./hci";

export type BleScanMode = "passive" | "active";
export type BleBinary = number[];

/**
 * All parameters are OR. If you set uuid and localName, obniz find uuid match but localName not match device.
 *
 * If you set BleScanSetting.filterOnDevice 'true', filters are apply on obniz device. So it reduce traffic.
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
   *
   * Specifying onfind will be called or not when an advertisement received from already known peripheral. Default is false : never called again.
   */
  duplicate?: boolean;

  /**
   * (obnizOS 3 or later only)
   *
   * Active scan or Passive Scan
   *
   * Default is true : activeScan.
   *
   */
  activeScan?: boolean;

  /**
   * (obnizOS >= 3.2.0 only)
   *
   * filters are apply on obniz device
   *
   * True: filter on device and JavaScript.<br/>
   * False : filter on JavaScript only.
   *
   * Default is false : filter on JavaScript only.
   *
   *
   * ```javascript
   * // Javascript Example
   * var target = {
   *     localName: "obniz-BLE",     //scan only has localName "obniz-BLE"
   * };
   *
   * var setting = {
   *    duration : 10,  //scan duration time in seconds. default is 30 sec.
   *    filterOnDevice: true
   * }
   *
   * await obniz.ble.initWait();
   * obniz.ble.scan.start(target, setting);
   * ```
   *
   *
   */
  filterOnDevice?: boolean;
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
  public onfinish?: (peripherals: BleRemotePeripheral[], error?: Error) => void;

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
  private _delayNotifyTimers: Array<{
    peripheral: BleRemotePeripheral;
    timer: NodeJS.Timeout;
  }> = [];

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
  public async start(target: BleScanTarget = {}, settings: BleScanSetting = {}) {
    this.startWait(target, settings).catch((reason) => {
      this.finish(reason);
    });
  }

  public async startWait(target: BleScanTarget = {}, settings: BleScanSetting = {}) {
    this.obnizBle.warningIfNotInitialize();

    const timeout: number | null = settings.duration === undefined ? 30 : settings.duration;
    settings.duplicate = !!settings.duplicate;
    settings.filterOnDevice = !!settings.filterOnDevice;
    settings.activeScan = settings.activeScan !== false;
    this.scanSettings = settings;

    target = target || {};
    this.scanTarget.binary = target.binary;
    this.scanTarget.deviceAddress = target.deviceAddress;
    this.scanTarget.localName = target.localName;
    this.scanTarget.localNamePrefix = target.localNamePrefix;
    this.scanTarget.uuids = [];
    if (target && target.uuids) {
      this.scanTarget.uuids = target.uuids.map((elm: UUID) => {
        return BleHelper.uuidFilter(elm);
      });
    }
    this.scanedPeripherals = [];
    this._clearDelayNotifyTimer();
    if (settings.filterOnDevice) {
      this._setTargetFilterOnDevice(this.scanTarget);
    } else {
      this._setTargetFilterOnDevice({}); // clear
    }
    await this.obnizBle.centralBindings.startScanningWait(null, false, settings.activeScan);

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
        const peripheral: BleRemotePeripheral = params;

        const alreadyGotCompleteAdveData =
          peripheral.adv_data &&
          peripheral.adv_data.length > 0 &&
          peripheral.scan_resp &&
          peripheral.scan_resp.length > 0;
        const nonConnectable = peripheral.ble_event_type === "non_connectable_advertising";
        const maybeAdvOnly =
          this._delayNotifyTimers.find((e) => e.peripheral.address === peripheral.address) &&
          (!peripheral.scan_resp || peripheral.scan_resp.length === 0);

        // wait for adv_data + scan resp
        // 10 seconds timeout
        if (alreadyGotCompleteAdveData || nonConnectable || maybeAdvOnly) {
          this._removeDelayNotifyTimer(peripheral.address);
          this._notifyOnFind(peripheral);
        } else {
          const timer = setInterval(() => {
            this._notifyOnFind(peripheral);
          }, 10000);
          this._delayNotifyTimers.push({ timer, peripheral });
        }

        break;
      }
      case "onfinish": {
        this.finish();
        break;
      }
    }
  }

  public finish(error?: Error) {
    this.clearTimeoutTimer();
    this._delayNotifyTimers.forEach((e) => this._notifyOnFind(e.peripheral));
    this._clearDelayNotifyTimer();
    this.emitter.emit("onfinish", this.scanedPeripherals, error);
    if (this.onfinish) {
      this.onfinish(this.scanedPeripherals, error);
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
        filters.push({
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

  protected _setTargetFilterOnDevice(scanTarget: BleScanTarget) {
    // < 3.2.0
    if (semver.lt(this.obnizBle.Obniz.firmware_ver!, "3.2.0")) {
      return;
    }

    const adFilters: BleScanAdvertisementFilterParam[] = [];
    if (scanTarget.uuids) {
      scanTarget.uuids.map((elm: UUID) => {
        adFilters.push({ uuid: BleHelper.uuidFilter(elm) });
      });
    }
    if (scanTarget.localName) {
      this._arrayWrapper(scanTarget.localName).forEach((name) => {
        adFilters.push({ localNamePrefix: name });
      });
    }

    if (scanTarget.deviceAddress) {
      this._arrayWrapper(scanTarget.deviceAddress).forEach((address) => {
        adFilters.push({ deviceAddress: address });
      });
    }

    if (scanTarget.localNamePrefix) {
      this._arrayWrapper(scanTarget.localNamePrefix).forEach((name) => {
        adFilters.push({ localNamePrefix: name });
      });
    }
    if (scanTarget.binary) {
      if (Array.isArray(scanTarget.binary[0])) {
        scanTarget.binary.forEach((e: any) => {
          adFilters.push({ binary: e });
        });
      } else {
        adFilters.push({ binary: scanTarget.binary as number[] });
      }
    }
    this._setAdvertisementFilter(adFilters);
  }

  protected isTarget(peripheral: BleRemotePeripheral) {
    const functionBinding = {
      localNamePrefix: this.isLocalNamePrefixTarget.bind(this),
      localName: this.isLocalNameTarget.bind(this),
      uuids: this.isUuidTarget.bind(this),
      deviceAddress: this.isDeviceAddressTarget.bind(this),
      binary: this.isBinaryTarget.bind(this),
    };

    if (!this.scanTarget) {
      // no filter
      return true;
    }

    let noFilter = true;
    // no filter
    for (const key in functionBinding) {
      const oneTarget: any = (this.scanTarget as any)[key] as any;
      if (oneTarget) {
        if (Array.isArray(oneTarget) && oneTarget.length > 0) {
          noFilter = false;
        } else if (!Array.isArray(oneTarget) && oneTarget) {
          noFilter = false;
        }
      }
    }
    if (noFilter) {
      return true;
    }

    let isTarget = false;
    for (const key in functionBinding) {
      const targetDetectFunc = (functionBinding as any)[key];
      isTarget = isTarget || targetDetectFunc(peripheral);
    }

    return isTarget;
  }

  protected clearTimeoutTimer() {
    if (this._timeoutTimer) {
      clearTimeout(this._timeoutTimer);
      this._timeoutTimer = undefined;
    }
  }

  private _notifyOnFind(peripheral: BleRemotePeripheral) {
    if (this.scanSettings.duplicate === false) {
      // duplicate filter
      if (this.scanedPeripherals.find((e: any) => e.address === peripheral.address)) {
        return;
      }
    }
    if (this.isTarget(peripheral)) {
      this.scanedPeripherals.push(peripheral);
      this.emitter.emit("onfind", peripheral);
      if (this.onfind) {
        this.onfind(peripheral);
      }
    }
  }

  private isLocalNameTarget(peripheral: BleRemotePeripheral) {
    if (!this.scanTarget.localName) {
      return false;
    }
    for (const name of this._arrayWrapper(this.scanTarget.localName)) {
      if (name === peripheral.localName) {
        return true;
      }
    }

    return false;
  }

  private isLocalNamePrefixTarget(peripheral: BleRemotePeripheral) {
    if (!this.scanTarget.localNamePrefix) {
      return false;
    }
    for (const name of this._arrayWrapper(this.scanTarget.localNamePrefix)) {
      if (peripheral.localName && peripheral.localName.startsWith(name)) {
        return true;
      }
    }

    return false;
  }

  private isBinaryTarget(peripheral: BleRemotePeripheral) {
    if (!this.scanTarget.binary) {
      return false;
    }
    return true; // cannot detect on obnizjs

    return false;
  }

  private isUuidTarget(peripheral: BleRemotePeripheral) {
    if (!this.scanTarget.uuids || this.scanTarget.uuids.length === 0) {
      return false;
    }
    const uuids: any = peripheral.advertisementServiceUuids().map((e: any) => {
      return BleHelper.uuidFilter(e);
    });
    for (const uuid of this.scanTarget.uuids) {
      if (uuids.includes(uuid)) {
        return true;
      }
    }
    return false;
  }

  private isDeviceAddressTarget(peripheral: BleRemotePeripheral) {
    if (!this.scanTarget.deviceAddress) {
      return false;
    }
    if (this.scanTarget.deviceAddress === peripheral.address) {
      return true;
    }
    return false;
  }

  private _clearDelayNotifyTimer() {
    this._delayNotifyTimers.forEach((e) => {
      clearTimeout(e.timer);
    });
    this._delayNotifyTimers = [];
  }

  private _removeDelayNotifyTimer(targetAddress: BleDeviceAddress) {
    this._delayNotifyTimers = this._delayNotifyTimers.filter((e) => {
      if (e.peripheral.address === targetAddress) {
        clearTimeout(e.timer);
        return false;
      }
      return true;
    });
  }
}
