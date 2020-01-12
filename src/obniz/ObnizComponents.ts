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

interface ObnizComponentsObnizBoard {

  // onconnect: () => Promise<void>;
  // onclose: () => Promise<void>;
  // wired<K extends keyof WiredNameMap>(name: K, options?: WiredNameOptionsMap[K]): WiredNameMap[K];
  //
  // // connect
  // connectionState: ConnectionState;
  // debugprint: boolean;
  // connect(): void;
  // connectWait(options?: ConnectOptions): Promise<boolean>;
  // close(): void;
  // resetOnDisconnect(reset: boolean): void;
  //
  // // systems
  // sleepSeconds(sec: number): void;
  // sleepMinute(sec: number): void;
  // sleep(date: Date): void;
  // sleepIoTrigger(trigger: boolean): void;
  // pingWait(): Promise<void>;
  //
  // // utils
  // util: any;
  // reset(): void;
  // repeat(callback: () => void): void;
  // wait(time: number): Promise<void>;
  // keepWorkingAtOffline(working: boolean): void;
  // setVccGnd(vcc: number, gnd: number, drive: DriveType): void;
  // isValidIO(io: any): io is PeripheralIO;

}

export default class ObnizComponents extends ObnizParts {

  public pongObservers: any;
  public _allComponentKeys: any;

  /* board peripherals */
  public io?: PeripheralDirective;
  public io0?: PeripheralIO;
  public io1?: PeripheralIO;
  public io2?: PeripheralIO;
  public io3?: PeripheralIO;
  public io4?: PeripheralIO;
  public io5?: PeripheralIO;
  public io6?: PeripheralIO;
  public io7?: PeripheralIO;
  public io8?: PeripheralIO;
  public io9?: PeripheralIO;
  public io10?: PeripheralIO;
  public io11?: PeripheralIO;

  public ad0?: PeripheralAD;
  public ad1?: PeripheralAD;
  public ad2?: PeripheralAD;
  public ad3?: PeripheralAD;
  public ad4?: PeripheralAD;
  public ad5?: PeripheralAD;
  public ad6?: PeripheralAD;
  public ad7?: PeripheralAD;
  public ad8?: PeripheralAD;
  public ad9?: PeripheralAD;
  public ad10?: PeripheralAD;
  public ad11?: PeripheralAD;

  public pwm0?: PeripheralPWM;
  public pwm1?: PeripheralPWM;
  public pwm2?: PeripheralPWM;
  public pwm3?: PeripheralPWM;
  public pwm4?: PeripheralPWM;
  public pwm5?: PeripheralPWM;

  public uart0?: PeripheralUART;
  public uart1?: PeripheralUART;
  public spi0?: PeripheralSPI;
  public spi1?: PeripheralSPI;
  public i2c0?: PeripheralI2C;
  public logicAnalyzer?: LogicAnalyzer;
  public measure?: ObnizMeasure;
  public display?: Display;
  public switch?: ObnizSwitch;
  public ble?: ObnizBLE | ObnizBLEHci;

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

  public _resetComponents() {
    this.print_debug("components state resets");
    for (const key of this._allComponentKeys) {
      (this as any)[key]._reset();
    }
  }

  public notifyToModule(obj: any) {
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

  public getIO(io: any): PeripheralIO {
    if (!this.isValidIO(io)) {
      throw new Error("io " + io + " is not valid io");
    }
    return (this as any)["io" + io];
  }

  public getAD(io: any): PeripheralAD {
    if (!this.isValidIO(io)) {
      throw new Error("ad " + io + " is not valid io");
    }
    return (this as any)["ad" + io];
  }

  public _getFreePeripheralUnit(peripheral: any): any {
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
}
