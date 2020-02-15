/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import emitter = require("eventemitter3");
import ObnizBLE from "./ble";
import BleHelper from "./bleHelper";
import BlePeripheral from "./blePeripheral";
import BleRemotePeripheral from "./bleRemotePeripheral";
import {UUID} from "./bleTypes";
import ObnizBLEHci from "./hci";

export interface BleScanTarget {
  /**
   * an array of scan target service uuids. If a peripheral has a one of listed uuid, then found.
   */
  uuids?: UUID[];

  /**
   * scan target device localName
   */
  localName?: string;
}

export interface BleScanSetting {
  /**
   * Timeout seconds of scanning.
   * Default is 30 seconds
   */
  duration?: number;

  /**
   * (obnizOS 3 or later only)
   *
   * Specifying onfind will be called or not when an advertisement received from already known peripheral.
   * Default is false : never called again.
   *
   *
   */
  duplicate?: boolean;
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
  protected emitter: emitter;
  protected scanedPeripherals: BleRemotePeripheral[];
  private _timeoutTimer?: NodeJS.Timeout;

  constructor(obnizBle: ObnizBLE) {
    this.scanTarget = {};
    this.scanSettings = {};
    this.obnizBle = obnizBle;
    this.emitter = new emitter();

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
  public start(target?: BleScanTarget, settings?: BleScanSetting) {
    this.obnizBle.warningIfNotInitialize();

    if (!settings) {
      settings = {};
    }
    const timeout: number = settings.duration || 30;
    settings.duplicate = !!settings.duplicate;
    this.scanSettings = settings;
    target = target || {};
    this.scanTarget = target;
    if (
      this.scanTarget &&
      this.scanTarget.uuids &&
      Array.isArray(this.scanTarget.uuids)
    ) {
      this.scanTarget.uuids = this.scanTarget.uuids.map((elm: UUID) => {
        return BleHelper.uuidFilter(elm);
      });
    }
    this.scanedPeripherals = [];

    this.obnizBle.centralBindings.startScanning(null, false);

    this.clearTimeoutTimer();
    this._timeoutTimer = setTimeout(() => {
      this._timeoutTimer = undefined;
      this.end();
    }, timeout * 1000);
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

  protected isTarget(peripheral: BleRemotePeripheral) {
    if (
      this.scanTarget &&
      this.scanTarget.localName &&
      peripheral.localName !== this.scanTarget.localName
    ) {
      return false;
    }
    if (this.scanTarget && this.scanTarget.uuids) {
      const uuids: any = peripheral.advertisementServiceUuids().map((e: any) => {
        return BleHelper.uuidFilter(e);
      });
      for (const uuid of this.scanTarget.uuids) {
        if (!uuids.includes(uuid)) {
          return false;
        }
      }
    }
    return true;
  }

  protected clearTimeoutTimer() {
    if (this._timeoutTimer) {
      clearTimeout(this._timeoutTimer);
      this._timeoutTimer = undefined;
    }
  }
}
