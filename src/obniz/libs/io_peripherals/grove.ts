/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import Obniz from "../../index";
import { ComponentAbstract } from "../ComponentAbstact";
import PeripheralAD from "./ad";
import { DriveType } from "./common";
import PeripheralI2C from "./i2c";
import PeripheralIO from "./io";
import PeripheralPWM from "./pwm";
import PeripheralUART from "./uart";

export interface PeripheralGroveParams {
  pin1: number;
  pin2: number;
  vcc?: number;
  gnd?: number;
}

export type PeripheralGroveType = "digital" | "analog" | "analog-digital" | "i2c" | "uart" | "pwm";
export type GrovePinOption = "default" | "secondaryOnly";
/**
 * @category Peripherals
 */
export default class PeripheralGrove extends ComponentAbstract {
  public no: number;
  public used: boolean = false;
  private _params: PeripheralGroveParams;
  private _current: {
    type?: PeripheralGroveType;
    drive?: DriveType;
    i2c?: PeripheralI2C;
    uart?: PeripheralUART;
    pwm?: PeripheralPWM;
  } = {};

  constructor(obniz: Obniz, no: number, params: PeripheralGroveParams) {
    super(obniz);
    this.no = no;
    this._params = params;
    this._reset();
  }

  public getDigital(
    drive: DriveType = "5v",
    pinOption: GrovePinOption = "default",
  ): { primary: PeripheralIO; secondary?: PeripheralIO } {
    this.useWithType("digital", drive);
    const primary = this.Obniz.isValidIO(this._params.pin1) ? this.Obniz.getIO(this._params.pin1) : undefined;
    const secondary = this.Obniz.isValidIO(this._params.pin2) ? this.Obniz.getIO(this._params.pin2) : undefined;

    if (!primary) {
      // required
      throw new Error("grove digital primary pin " + this._params.pin1 + " is not valid io");
    }
    if (pinOption === "default" && !primary) {
      // required
      throw new Error("grove digital primary pin " + this._params.pin1 + " is not valid io");
    }

    if (pinOption === "secondaryOnly" && !secondary) {
      // required
      throw new Error("grove digital secondary pin " + this._params.pin2 + " is not valid io");
    }
    return { primary, secondary };
  }

  public getAnalog(
    drive: DriveType = "5v",
    pinOption: GrovePinOption = "default",
  ): { primary?: PeripheralAD; secondary?: PeripheralAD } {
    this.useWithType("analog", drive);
    const primary = this.Obniz.isValidAD(this._params.pin1) ? this.Obniz.getAD(this._params.pin1) : undefined;
    const secondary = this.Obniz.isValidAD(this._params.pin2) ? this.Obniz.getAD(this._params.pin2) : undefined;

    if (pinOption === "default" && !primary) {
      // required
      throw new Error("grove analog primary pin " + this._params.pin1 + " is not valid io");
    }
    if (pinOption === "secondaryOnly" && !secondary) {
      // required
      throw new Error("grove analog secondary pin " + this._params.pin2 + " is not valid io");
    }
    return { primary, secondary };
  }

  public getAnalogDigital(drive: DriveType = "5v"): { analog: PeripheralAD; digital: PeripheralIO } {
    this.useWithType("analog-digital", drive);
    const analog = this.Obniz.isValidAD(this._params.pin1) ? this.Obniz.getAD(this._params.pin1) : undefined;
    const digital = this.Obniz.isValidIO(this._params.pin2) ? this.Obniz.getIO(this._params.pin2) : undefined;

    if (!analog) {
      // required
      throw new Error("grove analog pin " + this._params.pin1 + " is not valid io");
    }

    if (!digital) {
      // required
      throw new Error("grove digital pin " + this._params.pin2 + " is not valid io");
    }
    return { analog, digital };
  }

  public getI2c(frequency: number, drive: DriveType = "5v"): PeripheralI2C {
    this.useWithType("i2c", drive);
    if (!this._current.i2c) {
      this._current.i2c = this.Obniz.getI2CWithConfig({
        mode: "master",
        sda: this._params.pin2,
        scl: this._params.pin1,
        clock: frequency,
      });
    }
    return this._current.i2c;
  }

  public getUart(baud: number, drive: DriveType = "5v"): PeripheralUART {
    this.useWithType("uart", drive);
    this._current.uart = this.Obniz.getFreeUart();
    this._current.uart.start({
      rx: this._params.pin1,
      tx: this._params.pin2,
      baud,
      drive,
    });
    return this._current.uart;
  }

  public getPwm(drive: DriveType = "5v"): PeripheralPWM {
    this.useWithType("pwm", drive);
    this._current.pwm = this.Obniz.getFreePwm();
    this._current.pwm.start({
      io: this._params.pin1,
    });
    return this._current.pwm;
  }

  /**
   * @ignore
   */
  public _reset() {}

  public end() {
    this.used = false;
    if (this._current.uart) {
      this._current.uart.end();
    }
    if (this._current.i2c) {
      this._current.i2c.end();
    }
    if (this._current.type === "analog") {
      if (this.Obniz.isValidAD(this._params.pin1)) {
        this.Obniz.getAD(this._params.pin1).end();
      }
      if (this.Obniz.isValidAD(this._params.pin2)) {
        this.Obniz.getAD(this._params.pin2).end();
      }
    } else if (this._current.type === "analog-digital") {
      if (this.Obniz.isValidAD(this._params.pin1)) {
        this.Obniz.getAD(this._params.pin1).end();
      }
      // if (this.Obniz.isValidIO(this._params.pin2)) {
      //   this.Obniz.getIO(this._params.pin2).end();
      // }
    }
    this._current = {};
  }

  /**
   * @ignore
   * @param obj
   */
  public notified(obj: number) {
    // nothing
  }

  public schemaBasePath(): null {
    return null;
  }

  private useWithType(type: PeripheralGroveType, drive: DriveType) {
    if (this.used) {
      if (this._current.type !== "i2c" || this._current.drive !== drive) {
        throw new Error("Grove pins are already used.");
      }
    }
    this.used = true;
    this._current.type = type;
    this._current.drive = drive;

    this.Obniz.setVccGnd(this._params.vcc, this._params.gnd, drive);
    if (this.Obniz.isValidIO(this._params.pin1)) {
      this.Obniz.getIO(this._params.pin1).drive(drive);
    }
    if (this.Obniz.isValidIO(this._params.pin2)) {
      this.Obniz.getIO(this._params.pin2).drive(drive);
    }
  }
}
