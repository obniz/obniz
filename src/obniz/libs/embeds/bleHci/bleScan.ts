import emitter = require("eventemitter3");
import BleHelper from "./bleHelper";

class BleScan {
  public scanTarget: any;
  public scanSettings: any;
  public obnizBle: any;
  public emitter: any;
  public scanedPeripherals: any;
  public _timeoutTimer: any;

  constructor(obnizBle: any) {
    this.scanTarget = null;
    this.scanSettings = {};
    this.obnizBle = obnizBle;
    this.emitter = new emitter();

    this.scanedPeripherals = [];
    this._timeoutTimer = null;
  }

  public start(target: any, settings: any) {
    this.obnizBle.warningIfNotInitialize();

    if (!settings) {
      settings = {};
    }
    const timeout: any = settings.duration || 30;
    settings.duplicate = settings.duplicate === true ? true : false;
    this.scanSettings = settings;
    target = target || {};
    this.scanTarget = target;
    if (
      this.scanTarget &&
      this.scanTarget.uuids &&
      Array.isArray(this.scanTarget.uuids)
    ) {
      this.scanTarget.uuids = this.scanTarget.uuids.map ((elm: any ) => {
        return BleHelper.uuidFilter(elm);
      });
    }
    this.scanedPeripherals = [];

    this.obnizBle.centralBindings.startScanning(null, false);

    this.clearTimeoutTimer();
    this._timeoutTimer = setTimeout(() => {
      this._timeoutTimer = null;
      this.end();
    }, timeout * 1000);
  }

  public startOneWait(target: any, settings: any) {
    let state: any = 0;

    return new Promise ((resolve: any ) => {
      this.emitter.once("onfind", (param: any ) => {
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

  public startAllWait(target: any, settings: any) {
    return new Promise ((resolve: any ) => {
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
      const uuids: any = peripheral.advertisementServiceUuids().map ((e: any ) => {
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

  public notifyFromServer(notifyName: any, params: any) {
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
      this._timeoutTimer = null;
    }
  }
}

export default BleScan;
