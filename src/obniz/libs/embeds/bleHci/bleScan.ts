/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import { rejects } from "assert";
import EventEmitter from "eventemitter3";
import semver from "semver";
import { ObnizOfflineError } from "../../../ObnizError";
import Util from "../../utils/util";
import ObnizBLE from "./ble";
import BleHelper from "./bleHelper";
import BleRemotePeripheral from "./bleRemotePeripheral";
import { BleDeviceAddress, UUID } from "./bleTypes";

export type BleScanMode = "passive" | "active";
export type BleBinary = number[];

/**
 * All parameters are OR. If you set uuid and localName, obniz find uuid match but localName not match device.
 *
 * If you set BleScanSetting.filterOnDevice 'true', filters are apply on obniz device. So it reduce traffic.
 */
export interface BleScanTarget {
  /**
   * Service UUID for scan. Provide.
   * Attention: iBeacon uuid is not service uuid. If you want to filter iBeacon. use binary filter
   */
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
   * You need to enable `filterOnDevice:true` to use this filter.
   *
   * Search partially matches advertisement / scan response regarding provided byte array.
   * If advertisement / scan reponse has a matched byte array in the data, then passed.
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
   * await obniz.ble.scan.startWait(target, setting);
   * ```
   *
   *
   */
  filterOnDevice?: boolean;
}

type BleScanState = "stopped" | "stopping" | "started" | "starting";

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
   * await obniz.ble.scan.startWait();
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
   * await obniz.ble.scan.startWait();
   * ```
   */
  public onfind?: (peripheral: BleRemotePeripheral) => void;
  public state: BleScanState = "stopping";
  protected scanTarget: BleScanTarget;
  protected scanSettings: BleScanSetting;
  protected obnizBle: ObnizBLE;
  protected emitter: EventEmitter<"onfind" | "onfinish">;
  protected scanedPeripherals: BleRemotePeripheral[];
  private _timeoutTimer?: NodeJS.Timeout;
  private _delayNotifyTimers: Array<{
    peripheral: BleRemotePeripheral;
    timer: NodeJS.Timeout;
  }> = [];

  constructor(obnizBle: ObnizBLE) {
    this.obnizBle = obnizBle;
    this.emitter = new EventEmitter();
    this.scanTarget = {};
    this.scanSettings = {};

    this.scanedPeripherals = [];
    this._timeoutTimer = undefined;
  }

  /**
   * @ignore
   * @private
   */
  public _reset() {
    this.scanTarget = {};
    this.scanSettings = {};
    this.scanedPeripherals = [];

    this.clearTimeoutTimer();
    this.finish(new Error(`Reset Occured while scanning.`));
  }

  /**
   * Use startWait() instead.
   * @deprecated
   */
  public start(target: BleScanTarget = {}, settings: BleScanSetting = {}) {
    console.log(`start() is deprecated since 3.5.0. Use startWait() instead`);
    this.startWait(target, settings)
      .then(() => {})
      .catch((e) => {
        throw e;
      });
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
   * await obniz.ble.scan.startWait(target, setting);
   * ```
   *
   * This is also possible without params being valid.
   *
   * ```javascript
   * // Javascript Example
   * await obniz.ble.scan.startWait();
   * ```
   *
   * Scanning starts with no error and results with not advertisement found while a device is trying to connect a peripheral.
   * Before start scannnig. Establishing connection must be completed or canceled.
   *
   * @param target
   * @param settings
   */
  public async startWait(target: BleScanTarget = {}, settings: BleScanSetting = {}) {
    this.obnizBle.warningIfNotInitialize();
    this.state = "starting";

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
    await this.obnizBle.centralBindings.startScanningWait(null, settings.duplicate, settings.activeScan);

    this.clearTimeoutTimer();
    if (timeout !== null) {
      this._timeoutTimer = setTimeout(async () => {
        this._timeoutTimer = undefined;
        try {
          await this.endWait();
        } catch (e) {
          this.finish(e);
        }
      }, timeout * 1000);
    }

    this.state = "started";
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
  public async startOneWait(target: BleScanTarget, settings: BleScanSetting = {}): Promise<BleRemotePeripheral | null> {
    await this.startWait(target, settings);

    return new Promise((resolve: any, reject: any) => {
      this.emitter.once("onfind", async (peripheral: BleRemotePeripheral, error: any) => {
        if (error) {
          rejects(error);
          return;
        }
        resolve(peripheral);
        await this.endWait();
      });

      this.emitter.once("onfinish", (peripherals: BleRemotePeripheral[], error: any) => {
        if (error) {
          rejects(error);
          return;
        }
        resolve(null);
      });
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
  public async startAllWait(target: BleScanTarget, settings: BleScanSetting): Promise<BleRemotePeripheral[]> {
    await this.startWait(target, settings);
    return new Promise((resolve: any, reject: any) => {
      this.emitter.once("onfinish", (peripherals: BleRemotePeripheral, error: any) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(this.scanedPeripherals);
      });
    });
  }

  /**
   * Use endWait() instead
   * @deprecated
   */
  public end() {
    console.log(`end() is deprecated since 3.5.0. Use endWait() instead`);
    this.endWait()
      .then(() => {})
      .catch((e) => {
        throw e;
      });
  }

  /**
   * This stops scanning BLE.
   *
   * ```javascript
   * // Javascript Example
   * await obniz.ble.initWait();
   * await obniz.ble.scan.startWait();
   * await obniz.wait(5000);
   * await obniz.ble.scan.endWait();
   * ```
   */
  public async endWait() {
    if (this.state === "started" || this.state === "starting") {
      this.state = "stopping";
      this.clearTimeoutTimer();
      await this.obnizBle.centralBindings.stopScanningWait();
      this.finish(); // state will changed to stopped inside of this function.
    }
  }

  /**
   * @ignore
   * @param notifyName
   * @param params
   */
  public notifyFromServer(notifyName: string, params: any) {
    switch (notifyName) {
      case "obnizClose": {
        this.finish(new ObnizOfflineError());
        break;
      }
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
          const timer = setTimeout(() => {
            this._notifyOnFind(peripheral);
          }, 10000);
          this._delayNotifyTimers.push({ timer, peripheral });
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
      if (Array.isArray(scanTarget.binary)) {
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

  private finish(error?: Error) {
    if (this.state !== "stopped") {
      this.clearTimeoutTimer();
      this._delayNotifyTimers.forEach((e) => this._notifyOnFind(e.peripheral));
      this._clearDelayNotifyTimer();
      this.state = "stopped";
      this.emitter.emit("onfinish", this.scanedPeripherals, error);
      this.obnizBle.Obniz._runUserCreatedFunction(this.onfinish, this.scanedPeripherals, error);
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
      this.obnizBle.Obniz._runUserCreatedFunction(this.onfind, peripheral);
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
    for (const uuid of this._arrayWrapper(this.scanTarget.uuids)) {
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
    for (const deviceAddress of this._arrayWrapper(this.scanTarget.deviceAddress)) {
      if (deviceAddress === peripheral.address) {
        return true;
      }
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
