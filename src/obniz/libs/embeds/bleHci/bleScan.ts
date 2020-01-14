import emitter = require("eventemitter3");
import ObnizBLE from "./ble";
import BleHelper from "./bleHelper";
import BlePeripheral from "./blePeripheral";
import {UUID} from "./bleTypes";
import ObnizBLEHci from "./hci";

export interface BleScanTarget {
  uuids?: UUID[];
  localName?: string;
}

export interface BleScanSetting {
  duration?: number;
  duplicate?: boolean;
}

class BleScan {
  public scanTarget: BleScanTarget;
  public scanSettings: BleScanSetting;
  public obnizBle: ObnizBLE;
  public emitter: emitter;
  public scanedPeripherals: BlePeripheral[];
  private _timeoutTimer?: NodeJS.Timeout;

  constructor(obnizBle: ObnizBLE) {
    this.scanTarget = {};
    this.scanSettings = {};
    this.obnizBle = obnizBle;
    this.emitter = new emitter();

    this.scanedPeripherals = [];
    this._timeoutTimer = undefined;
  }

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

  public startAllWait(target: BleScanTarget, settings: BleScanSetting): Promise<BlePeripheral[]> {
    return new Promise((resolve: any) => {
      this.emitter.once("onfinish", () => {
        resolve(this.scanedPeripherals);
      });

      this.start(target, settings);
    });
  }

  public end() {
    this.clearTimeoutTimer();
    this.obnizBle.centralBindings.stopScanning();
  }

  public isTarget(peripheral: any) {
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

  public onfinish(data: any) {
  } // dummy
  public onfind(params: any) {
  } // dummy

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
          this.onfind(params);
        }
        break;
      }
      case "onfinish": {
        this.clearTimeoutTimer();
        this.emitter.emit(notifyName, this.scanedPeripherals);
        this.onfinish(this.scanedPeripherals);
        break;
      }
    }
  }

  public clearTimeoutTimer() {
    if (this._timeoutTimer) {
      clearTimeout(this._timeoutTimer);
      this._timeoutTimer = undefined;
    }
  }
}

export default BleScan;
