import emitter = require("eventemitter3");
import BleHelper from "./bleHelper";

class BleScan {
  public scanTarget: any;
  public Obniz: any;
  public emitter: any;
  public scanedPeripherals: any;

  constructor(Obniz: any) {
    this.scanTarget = null;
    this.Obniz = Obniz;
    this.emitter = new emitter();

    this.scanedPeripherals = [];
  }

  public start(target: any, settings: any) {
    const obj: any = {};
    obj.ble = {};
    obj.ble.scan = {
      //    "targetUuid" : settings && settings.targetUuid ? settings.targetUuid : null,
      //    "interval" : settings && settings.interval ? settings.interval : 30,
      duration: settings && settings.duration ? settings.duration : 30,
    };
    if (settings && settings.duplicate) {
      throw new Error(
        `duplicate property can only be used with obnizOS3 or later`,
      );
    }

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
    this.Obniz.send(obj);
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
    const obj: any = {};
    obj.ble = {};
    obj.ble.scan = null;
    this.Obniz.send(obj);
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

  public onfinish(scanedPeripherals: any) {
  } // dummy
  public onfind(params: any) {
  } // dummy

  public notifyFromServer(notifyName: any, params: any) {
    switch (notifyName) {
      case "onfind": {
        if (this.isTarget(params)) {
          this.scanedPeripherals.push(params);
          this.emitter.emit(notifyName, params);
          this.onfind(params);
        }
        break;
      }
      case "onfinish": {
        this.emitter.emit(notifyName, this.scanedPeripherals);
        this.onfinish(this.scanedPeripherals);
        break;
      }
    }
  }
}

export default BleScan;
