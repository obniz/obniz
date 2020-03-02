/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import Obniz from "../../index";
import PeripheralAD from "./ad";
import {DriveType} from "./common";
import PeripheralI2C from "./i2c";
import PeripheralIO from "./io";
import PeripheralUART from "./uart";

export interface PeripheralGroveParams {
  pin1: number;
  pin2: number;
  vcc?: number;
  gnd?: number;
}

export type PeripheralGroveType = "digital" | "analog" | "i2c" | "uart";

/**
 * @category Peripherals
 */
export default class PeripheralGrove {
  public Obniz: Obniz;
  public no: number;
  public used: boolean = false;
  private _params: PeripheralGroveParams;
  private _current: { type?: PeripheralGroveType, drive?: DriveType, i2c?: PeripheralI2C, uart?: PeripheralUART } = {};

  constructor(obniz: Obniz, no: number, params: PeripheralGroveParams) {
    this.Obniz = obniz;
    this.no = no;
    this._params = params;
    this._reset();
  }

  public getDigital(drive: DriveType = "5v"): { primary?: PeripheralIO, secondary?: PeripheralIO } {
    this.useWithType("digital", drive);
    const primary = this.Obniz.isValidIO(this._params.pin1) ? this.Obniz.getIO(this._params.pin1) : undefined;
    const secondary = this.Obniz.isValidIO(this._params.pin2) ? this.Obniz.getIO(this._params.pin2) : undefined;
    return {primary, secondary};
  }

  public getAnalog(drive: DriveType = "5v"): { primary?: PeripheralAD, secondary?: PeripheralAD } {
    this.useWithType("analog", drive);
    const primary = this.Obniz.isValidAD(this._params.pin1) ? this.Obniz.getAD(this._params.pin1) : undefined;
    const secondary = this.Obniz.isValidAD(this._params.pin2) ? this.Obniz.getAD(this._params.pin2) : undefined;
    return {primary, secondary};

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
    this._current.uart.start({rx: this._params.pin1, tx: this._params.pin2, baud, drive});
    return this._current.uart;

  }

  /**
   * @ignore
   */
  public _reset() {
  }

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
