/**
 * @packageDocumentation
 * @module ObnizCore
 */

import semver from "semver";
import ObnizHciBLE from "./libs/embeds/bleHci/ble";
import Display from "./libs/embeds/display";
import ObnizSwitch from "./libs/embeds/switch";

import PeripheralAD from "./libs/io_peripherals/ad";
import { DriveType } from "./libs/io_peripherals/common";
import PeripheralDirective from "./libs/io_peripherals/directive";
import PeripheralI2C from "./libs/io_peripherals/i2c";
import PeripheralIO from "./libs/io_peripherals/io";
import PeripheralPWM from "./libs/io_peripherals/pwm";
import PeripheralSPI from "./libs/io_peripherals/spi";
import PeripheralUART from "./libs/io_peripherals/uart";
import LogicAnalyzer from "./libs/measurements/logicanalyzer";
import ObnizMeasure from "./libs/measurements/measure";
import WiFi from "./libs/network/wifi";
import Plugin from "./libs/plugin/plugin";

import TCP from "./libs/protocol/tcp";

import ObnizParts from "./ObnizParts";

import { ComponentAbstract } from "./libs/ComponentAbstact";
import HW from "./libs/hw";
import PeripheralGrove from "./libs/io_peripherals/grove";
import { ObnizOptions } from "./ObnizOptions";

export default abstract class ObnizComponents extends ObnizParts {
  /* board peripherals */

  /**
   * @category Peripherals
   */
  public io?: PeripheralDirective;

  /**
   * @category Peripherals
   */
  public io0?: PeripheralIO;

  /**
   * @category Peripherals
   */
  public io1?: PeripheralIO;

  /**
   * @category Peripherals
   */
  public io2?: PeripheralIO;

  /**
   * @category Peripherals
   */
  public io3?: PeripheralIO;

  /**
   * @category Peripherals
   */
  public io4?: PeripheralIO;

  /**
   * @category Peripherals
   */
  public io5?: PeripheralIO;

  /**
   * @category Peripherals
   */
  public io6?: PeripheralIO;

  /**
   * @category Peripherals
   */
  public io7?: PeripheralIO;

  /**
   * @category Peripherals
   */
  public io8?: PeripheralIO;

  /**
   * @category Peripherals
   */
  public io9?: PeripheralIO;

  /**
   * @category Peripherals
   */
  public io10?: PeripheralIO;

  /**
   * @category Peripherals
   */
  public io11?: PeripheralIO;

  /**
   * @category Peripherals
   */
  public ad0?: PeripheralAD;

  /**
   * @category Peripherals
   */
  public ad1?: PeripheralAD;

  /**
   * @category Peripherals
   */
  public ad2?: PeripheralAD;

  /**
   * @category Peripherals
   */
  public ad3?: PeripheralAD;

  /**
   * @category Peripherals
   */
  public ad4?: PeripheralAD;

  /**
   * @category Peripherals
   */
  public ad5?: PeripheralAD;

  /**
   * @category Peripherals
   */
  public ad6?: PeripheralAD;

  /**
   * @category Peripherals
   */
  public ad7?: PeripheralAD;

  /**
   * @category Peripherals
   */
  public ad8?: PeripheralAD;

  /**
   * @category Peripherals
   */
  public ad9?: PeripheralAD;

  /**
   * @category Peripherals
   */
  public ad10?: PeripheralAD;

  /**
   * @category Peripherals
   */
  public ad11?: PeripheralAD;

  /**
   * @category Peripherals
   */
  public pwm0?: PeripheralPWM;

  /**
   * @category Peripherals
   */
  public pwm1?: PeripheralPWM;

  /**
   * @category Peripherals
   */
  public pwm2?: PeripheralPWM;

  /**
   * @category Peripherals
   */
  public pwm3?: PeripheralPWM;

  /**
   * @category Peripherals
   */
  public pwm4?: PeripheralPWM;

  /**
   * @category Peripherals
   */
  public pwm5?: PeripheralPWM;

  /**
   * @category Peripherals
   */
  public uart0?: PeripheralUART;

  /**
   * @category Peripherals
   */
  public uart1?: PeripheralUART;

  /**
   * @category Peripherals
   */
  public spi0?: PeripheralSPI;

  /**
   * @category Peripherals
   */
  public spi1?: PeripheralSPI;

  /**
   * @category Peripherals
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
   * If obnizOS ver >= 3.0.0, automatically load [[ObnizCore.Components.Ble.Hci.ObnizBLE|ObnizHciBLE]],
   * and obnizOS ver < 3.0.0 throw unsupported Error,
   * @category Embeds
   */
  public ble?: ObnizHciBLE;

  /**
   * @category plugin
   */
  public plugin?: Plugin;

  protected _hwDefinition: any;

  protected pongObservers: any;
  protected _allComponentKeys: any;
  protected _hw_peripherals: any;

  constructor(id: string, options?: ObnizOptions) {
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

  /**
   * Output pin Vcc and Gnd
   * @param vcc
   * @param gnd
   * @param drive
   */
  public setVccGnd(vcc: number | null | undefined, gnd: number | null | undefined, drive: DriveType) {
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

  /**
   * Get IO module from pin no
   * @param io
   */
  public getIO(io: number): PeripheralIO {
    if (!this.isValidIO(io)) {
      throw new Error("io " + io + " is not valid io");
    }
    return (this as any)["io" + io];
  }

  /**
   * GET AD module from pin no
   * @param io
   */
  public getAD(io: number): PeripheralAD {
    if (!this.isValidIO(io)) {
      throw new Error("ad " + io + " is not valid io");
    }
    return (this as any)["ad" + io];
  }

  /**
   * It returns unused PWM module.
   */
  public getFreePwm(): PeripheralPWM {
    return this._getFreePeripheralUnit("pwm");
  }

  /**
   * It returns unused I2C module.
   */
  public getFreeI2C(): PeripheralI2C {
    return this._getFreePeripheralUnit("i2c");
  }

  /**
   * It returns setuped I2C module .
   * @param config
   */
  public getI2CWithConfig(config: any): PeripheralI2C {
    if (typeof config !== "object") {
      throw new Error("getI2CWithConfig need config arg");
    }
    if (config.i2c) {
      return config.i2c;
    }
    const i2c: PeripheralI2C = this.getFreeI2C();
    i2c.start(config);
    return i2c;
  }

  /**
   * It returns unused SPI module.
   */
  public getFreeSpi(): PeripheralSPI {
    return this._getFreePeripheralUnit("spi");
  }

  /**
   * It returns setuped SPI module.
   * @param config
   */
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

  /**
   * It returns unused UART module.
   */
  public getFreeUart(): PeripheralUART {
    return this._getFreePeripheralUnit("uart");
  }

  /**
   * It returns unused TCP module.
   */
  public getFreeTcp() {
    return this._getFreePeripheralUnit("tcp");
  }

  public hasExtraInterface(interfaceName: string): boolean {
    return !!this.getExtraInterface(interfaceName);
  }

  public getExtraInterface(interfaceName: string): any {
    if (this._hwDefinition.extraInterface && this._hwDefinition.extraInterface[interfaceName]) {
      return this._hwDefinition.extraInterface[interfaceName];
    }
    return null;
  }

  protected _callOnConnect() {
    this._prepareComponents();
    super._callOnConnect();
  }

  protected _prepareComponents() {
    if (this._allComponentKeys.length !== 0) {
      return;
    }

    this._hwDefinition = HW.getDefinitionFor(this.hw);
    if (!this._hwDefinition) {
      throw new Error(`unkown hw ${this.hw}`);
    }

    const hw_peripherals: any = this._hwDefinition.peripherals;
    this._hw_peripherals = hw_peripherals;
    const hw_embeds: any = this._hwDefinition.embeds;
    const hw_protocol: any = this._hwDefinition.protocol;
    const hw_network: any = this._hwDefinition.network;

    const shared_map: any = {
      io: PeripheralDirective,
      logicAnalyzer: LogicAnalyzer,
      measure: ObnizMeasure,
      plugin: Plugin,
    };

    const peripheral_map: any = {
      io: PeripheralIO,
      ad: PeripheralAD,
      uart: PeripheralUART,
      spi: PeripheralSPI,
      i2c: PeripheralI2C,
      pwm: PeripheralPWM,
      grove: PeripheralGrove,
    };

    const ble: any = ObnizHciBLE;

    const embeds_map: any = {
      display: Display,
      switch: ObnizSwitch,
      ble,
    };

    const protocol_map: any = {
      tcp: TCP,
    };

    const network_map: any = {
      wifi: WiFi,
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
            (this as any)[key + unitIdNumber] = new Class(this, unitIdNumber, units[unitId]);
            this._allComponentKeys.push(key + unitIdNumber);
          }
        }
      }
    }

    if (hw_embeds) {
      for (const key in embeds_map) {
        if (hw_embeds[key]) {
          const Class: any = embeds_map[key];
          (this as any)[key] = new Class(this, hw_embeds[key]);
          this._allComponentKeys.push(key);
          if (typeof (this as any)[key].debugHandler === "function") {
            (this as any)[key].debugHandler = (text: any) => {
              this.print_debug(text);
            };
          }
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

    if (hw_network) {
      for (const key in network_map) {
        if (hw_network[key]) {
          const Class: any = network_map[key];
          (this as any)[key] = new Class(this, hw_embeds[key]);
          this._allComponentKeys.push(key);
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
      const targetComponent = (this as any)[key];
      if (targetComponent instanceof ComponentAbstract) {
        const basePath = targetComponent.schemaBasePath();
        if (basePath && obj.hasOwnProperty(basePath)) {
          targetComponent.notifyFromObniz(obj[basePath]);
        }
      } else {
        if (key === "logicAnalyzer") {
          if (obj.hasOwnProperty("logic_analyzer")) {
            (this as any).logicAnalyzer.notified(obj.logic_analyzer);
          }
          continue;
        }
        if (obj.hasOwnProperty(key)) {
          /* because of nullable */
          targetComponent.notified(obj[key]);
        }
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
