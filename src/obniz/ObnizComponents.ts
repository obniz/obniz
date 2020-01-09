import semver = require("semver");
import ObnizBLE from "./libs/embeds/ble/ble";
import ObnizBLEHci from "./libs/embeds/bleHci/ble";
import Display from "./libs/embeds/display";
import ObnizSwitch from "./libs/embeds/switch";

import PeripheralAD from "./libs/io_peripherals/ad";
import PeripheralDirective from "./libs/io_peripherals/directive";
import PeripheralI2C from "./libs/io_peripherals/i2c";
import PeripheralIO from "./libs/io_peripherals/io";
import PeripheralPWM from "./libs/io_peripherals/pwm";
import PeripheralSPI from "./libs/io_peripherals/spi";
import PeripheralUART from "./libs/io_peripherals/uart";
import LogicAnalyzer from "./libs/measurements/logicanalyzer";
import ObnizMeasure from "./libs/measurements/measure";

import TCP from "./libs/protocol/tcp";

import ObnizParts from "./ObnizParts";

import HW from "./libs/hw";

export default class ObnizComponents extends ObnizParts {
  constructor(id: any, options: any) {
    super(id, options);
    this.pongObservers = [];
    this._allComponentKeys = [];
  }

  public close() {
    super.close();
    if (this.options.reset_obniz_on_ws_disconnection) {
      this._resetComponents();
    }
  }

  public _callOnConnect() {
    this._prepareComponents();
    super._callOnConnect();
  }

  public _prepareComponents() {
    if (this._allComponentKeys.length !== 0) {
      return;
    }

    const hwDefinition: any = HW.getDefinitionFor(this.hw);
    if (!hwDefinition) {
      throw new Error(`unkown hw ${this.hw}`);
    }

    const hw_peripherals: any = hwDefinition.peripherals;
    const hw_embeds: any = hwDefinition.embeds;
    const hw_protocol: any = hwDefinition.protocol;

    const shared_map: any = {
      io: PeripheralDirective,
      logicAnalyzer: LogicAnalyzer,
      measure: ObnizMeasure,
    };

    const peripheral_map: any = {
      io: PeripheralIO,
      ad: PeripheralAD,
      uart: PeripheralUART,
      spi: PeripheralSPI,
      i2c: PeripheralI2C,
      pwm: PeripheralPWM,
    };

    let ble: any = ObnizBLEHci;

    // < 3.0.0-beta
    if (semver.lt(this.firmware_ver, "3.0.0-beta")) {
      ble = ObnizBLE;
    }

    const embeds_map: any = {
      display: Display,
      switch: ObnizSwitch,
      ble,
    };

    const protocol_map: any = {
      tcp: TCP,
    };

    for (const key in shared_map) {
      const Class: any = shared_map[key];
      this[key] = new Class(this);
      this._allComponentKeys.push(key);
    }

    if (hw_peripherals) {
      for (const key in peripheral_map) {
        if (hw_peripherals[key]) {
          const units: any = hw_peripherals[key].units;
          const Class: any = peripheral_map[key];
          for (let unitId in units) {
            unitId = parseInt(unitId);
            this[key + unitId] = new Class(this, unitId);
            this._allComponentKeys.push(key + unitId);
          }
        }
      }
    }

    if (hw_embeds) {
      for (const key in embeds_map) {
        if (hw_embeds[key]) {
          const Class: any = embeds_map[key];
          this[key] = new Class(this);
          this._allComponentKeys.push(key);
        }
      }
    }

    if (hw_protocol) {
      for (const key in protocol_map) {
        if (hw_protocol[key]) {
          const units: any = hw_protocol[key].units;
          const Class: any = protocol_map[key];
          for (let unitId in units) {
            unitId = parseInt(unitId);
            this[key + unitId] = new Class(this, unitId);
            this._allComponentKeys.push(key + unitId);
          }
        }
      }
    }
  }

  public _resetComponents() {
    this.print_debug("components state resets");
    for (const key of this._allComponentKeys) {
      this[key]._reset();
    }
  }

  public notifyToModule(obj: any) {
    super.notifyToModule(obj);
    for (const key of this._allComponentKeys) {
      if (key === "logicAnalyzer") {
        if (obj.hasOwnProperty("logic_analyzer")) {
          this.logicAnalyzer.notified(obj.logic_analyzer);
        }
        continue;
      }
      if (obj.hasOwnProperty(key)) {
        /* because of nullable */
        this[key].notified(obj[key]);
      }
    }
  }

  public handleSystemCommand(wsObj: any) {
    super.handleSystemCommand(wsObj);
    // ping pong
    if (wsObj.pong) {
      for (const callback of this.pongObservers) {
        callback(wsObj);
      }
    }
  }

  public addPongObserver(callback: any) {
    if (callback) {
      this.pongObservers.push(callback);
    }
  }

  public removePongObserver(callback: any) {
    if (this.pongObservers.includes(callback)) {
      const index: any = this.pongObservers.indexOf(callback);
      this.pongObservers.splice(index, 1);
    }
  }

  public isValidIO(io: any) {
    return typeof io === "number" && this["io" + io] !== null;
  }

  public setVccGnd(vcc: any, gnd: any, drive: any) {
    if (this.isValidIO(vcc)) {
      if (drive) {
        this.getIO(vcc).drive(drive);
      }
      this.getIO(vcc).output(true);
    }

    if (this.isValidIO(gnd)) {
      if (drive) {
        this.getIO(gnd).drive(drive);
      }
      this.getIO(gnd).output(false);
    }
  }

  public getIO(io: any) {
    if (!this.isValidIO(io)) {
      throw new Error("io " + io + " is not valid io");
    }
    return this["io" + io];
  }

  public getAD(io: any) {
    if (!this.isValidIO(io)) {
      throw new Error("ad " + io + " is not valid io");
    }
    return this["ad" + io];
  }

  public _getFreePeripheralUnit(peripheral: any) {
    for (const key of this._allComponentKeys) {
      if (key.indexOf(peripheral) === 0) {
        /* "io" for "io0" */
        const obj: any = this[key];
        if (typeof obj === "object" && !obj.isUsed()) {
          obj.used = true;
          return obj;
        }
      }
    }
    throw new Error(`No More ${peripheral} Available.`);
  }

  public getFreePwm() {
    return this._getFreePeripheralUnit("pwm");
  }

  public getFreeI2C() {
    return this._getFreePeripheralUnit("i2c");
  }

  public getI2CWithConfig(config: any) {
    if (typeof config !== "object") {
      throw new Error("getI2CWithConfig need config arg");
    }
    if (config.i2c) {
      return config.i2c;
    }
    const i2c: any = this.getFreeI2C();
    i2c.start(config);
    return i2c;
  }

  public getFreeSpi() {
    return this._getFreePeripheralUnit("spi");
  }

  public getSpiWithConfig(config: any) {
    if (typeof config !== "object") {
      throw new Error("getSpiWithConfig need config arg");
    }
    if (config.spi) {
      return config.spi;
    }
    const spi: any = this.getFreeSpi();
    spi.start(config);
    return spi;
  }

  public getFreeUart() {
    return this._getFreePeripheralUnit("uart");
  }

  public getFreeTcp() {
    return this._getFreePeripheralUnit("tcp");
  }
}
