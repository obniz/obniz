/**
 * @packageDocumentation
 * @module ObnizCore
 */

import semver = require("semver");
import ObnizBLE from "./libs/embeds/ble/ble";
import ObnizBLEHci from "./libs/embeds/bleHci/ble";
import Display from "./libs/embeds/display";
import ObnizSwitch from "./libs/embeds/switch";

import PeripheralAD from "./libs/io_peripherals/ad";
import {DriveType} from "./libs/io_peripherals/common";
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
import {ObnizOptions} from "./ObnizOptions";

export default class ObnizComponents extends ObnizParts {

  /* board peripherals */

  /**
   * @category IO
   */
  public io!: PeripheralDirective;

  /**
   * @category IO
   */
  public io0?: PeripheralIO;

  /**
   * @category IO
   */
  public io1?: PeripheralIO;

  /**
   * @category IO
   */
  public io2?: PeripheralIO;

  /**
   * @category IO
   */
  public io3?: PeripheralIO;

  /**
   * @category IO
   */
  public io4?: PeripheralIO;

  /**
   * @category IO
   */
  public io5?: PeripheralIO;

  /**
   * @category IO
   */
  public io6?: PeripheralIO;

  /**
   * @category IO
   */
  public io7?: PeripheralIO;

  /**
   * @category IO
   */
  public io8?: PeripheralIO;

  /**
   * @category IO
   */
  public io9?: PeripheralIO;

  /**
   * @category IO
   */
  public io10?: PeripheralIO;

  /**
   * @category IO
   */
  public io11?: PeripheralIO;

  /**
   * @category AD
   */
  public ad0?: PeripheralAD;

  /**
   * @category AD
   */
  public ad1?: PeripheralAD;

  /**
   * @category AD
   */
  public ad2?: PeripheralAD;

  /**
   * @category AD
   */
  public ad3?: PeripheralAD;

  /**
   * @category AD
   */
  public ad4?: PeripheralAD;

  /**
   * @category AD
   */
  public ad5?: PeripheralAD;

  /**
   * @category AD
   */
  public ad6?: PeripheralAD;

  /**
   * @category AD
   */
  public ad7?: PeripheralAD;

  /**
   * @category AD
   */
  public ad8?: PeripheralAD;

  /**
   * @category AD
   */
  public ad9?: PeripheralAD;

  /**
   * @category AD
   */
  public ad10?: PeripheralAD;

  /**
   * @category AD
   */
  public ad11?: PeripheralAD;

  /**
   * @category PWM
   */
  public pwm0?: PeripheralPWM;

  /**
   * @category PWM
   */
  public pwm1?: PeripheralPWM;

  /**
   * @category PWM
   */
  public pwm2?: PeripheralPWM;

  /**
   * @category PWM
   */
  public pwm3?: PeripheralPWM;

  /**
   * @category PWM
   */
  public pwm4?: PeripheralPWM;

  /**
   * @category PWM
   */
  public pwm5?: PeripheralPWM;

  /**
   * @category UART
   */
  public uart0?: PeripheralUART;

  /**
   * @category UART
   */
  public uart1?: PeripheralUART;

  /**
   * @category SPI
   */
  public spi0?: PeripheralSPI;

  /**
   * @category SPI
   */
  public spi1?: PeripheralSPI;

  /**
   * @category I2C
   */
  public i2c0?: PeripheralI2C;

  /**
   * @category Measurement
   */
  public logicAnalyzer?: LogicAnalyzer;

  /**
   * @category Measurement
   */
  public measure?: ObnizMeasure;

  /**
   * @category Embeds
   */
  public display?: Display;

  /**
   * @category Embeds
   */
  public switch?: ObnizSwitch;

  /**
   * @category Embeds
   */
  public ble?: ObnizBLE | ObnizBLEHci;

  protected pongObservers: any;
  protected _allComponentKeys: any;

  constructor(id: any, options?: ObnizOptions) {
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

  public setVccGnd(vcc: number | null, gnd: number | null, drive: DriveType) {
    if (this.isValidIO(vcc)) {
      if (drive) {
        this.getIO(vcc!).drive(drive);
      }
      this.getIO(vcc!).output(true);
    }

    if (this.isValidIO(gnd)) {
      if (drive) {
        this.getIO(gnd!).drive(drive);
      }
      this.getIO(gnd!).output(false);
    }
  }

  public getIO(io: number): PeripheralIO {
    if (!this.isValidIO(io)) {
      throw new Error("io " + io + " is not valid io");
    }
    return (this as any)["io" + io];
  }

  public getAD(io: number): PeripheralAD {
    if (!this.isValidIO(io)) {
      throw new Error("ad " + io + " is not valid io");
    }
    return (this as any)["ad" + io];
  }

  public getFreePwm(): PeripheralPWM {
    return this._getFreePeripheralUnit("pwm");
  }

  public getFreeI2C(): PeripheralI2C {
    return this._getFreePeripheralUnit("i2c");
  }

  public getI2CWithConfig(config: any): PeripheralI2C {
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

  public getFreeSpi(): PeripheralSPI {
    return this._getFreePeripheralUnit("spi");
  }

  public getSpiWithConfig(config: any): PeripheralSPI {
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

  public getFreeUart(): PeripheralUART {
    return this._getFreePeripheralUnit("uart");
  }

  public getFreeTcp() {
    return this._getFreePeripheralUnit("tcp");
  }

  protected _callOnConnect() {
    this._prepareComponents();
    super._callOnConnect();
  }

  protected _prepareComponents() {
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
      (this as any)[key] = new Class(this);
      this._allComponentKeys.push(key);
    }

    if (hw_peripherals) {
      for (const key in peripheral_map) {
        if (hw_peripherals[key]) {
          const units: any = hw_peripherals[key].units;
          const Class: any = peripheral_map[key];
          for (const unitId in units) {
            const unitIdNumber = parseInt(unitId);
            (this as any)[key + unitIdNumber] = new Class(this, unitIdNumber);
            this._allComponentKeys.push(key + unitIdNumber);
          }
        }
      }
    }

    if (hw_embeds) {
      for (const key in embeds_map) {
        if (hw_embeds[key]) {
          const Class: any = embeds_map[key];
          (this as any)[key] = new Class(this);
          this._allComponentKeys.push(key);
        }
      }
    }

    if (hw_protocol) {
      for (const key in protocol_map) {
        if (hw_protocol[key]) {
          const units: any = hw_protocol[key].units;
          const Class: any = protocol_map[key];
          for (const unitId in units) {
            const unitIdNumber = parseInt(unitId);
            (this as any)[key + unitIdNumber] = new Class(this, unitIdNumber);
            this._allComponentKeys.push(key + unitIdNumber);
          }
        }
      }
    }
  }

  protected _resetComponents() {
    this.print_debug("components state resets");
    for (const key of this._allComponentKeys) {
      (this as any)[key]._reset();
    }
  }

  protected notifyToModule(obj: any) {
    super.notifyToModule(obj);
    for (const key of this._allComponentKeys) {
      if (key === "logicAnalyzer") {
        if (obj.hasOwnProperty("logic_analyzer")) {
          (this as any).logicAnalyzer.notified(obj.logic_analyzer);
        }
        continue;
      }
      if (obj.hasOwnProperty(key)) {
        /* because of nullable */
        (this as any)[key].notified(obj[key]);
      }
    }
  }

  protected handleSystemCommand(wsObj: any) {
    super.handleSystemCommand(wsObj);
    // ping pong
    if (wsObj.pong) {
      for (const callback of this.pongObservers) {
        callback(wsObj);
      }
    }
  }

  protected addPongObserver(callback: any) {
    if (callback) {
      this.pongObservers.push(callback);
    }
  }

  protected removePongObserver(callback: any) {
    if (this.pongObservers.includes(callback)) {
      const index: any = this.pongObservers.indexOf(callback);
      this.pongObservers.splice(index, 1);
    }
  }

  protected _getFreePeripheralUnit(peripheral: any): any {
    for (const key of this._allComponentKeys) {
      if (key.indexOf(peripheral) === 0) {
        /* "io" for "io0" */
        const obj: any = (this as any)[key];
        if (typeof obj === "object" && !obj.isUsed()) {
          obj.used = true;
          return obj;
        }
      }
    }
    throw new Error(`No More ${peripheral} Available.`);
  }
}
