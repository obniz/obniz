/**
 * @packageDocumentation
 * @module Parts.Solenoid
 */

import Obniz from "../../../obniz";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface SolenoidOptions {
  signal: number;
  gnd?: number;
}

export default class Solenoid implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Solenoid",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  protected obniz!: Obniz;

  private io_gnd?: PeripheralIO;
  private io_signal!: PeripheralIO;

  constructor() {
    this.keys = ["gnd", "signal"];
    this.requiredKeys = ["signal"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    if (obniz.isValidIO(this.params.gnd)) {
      this.io_gnd = obniz.getIO(this.params.gnd);
      this.io_gnd.output(false);
    }

    this.io_signal = obniz.getIO(this.params.signal);
    this.io_signal.output(false);
  }

  public on() {
    this.io_signal.output(true);
  }

  public off() {
    this.io_signal.output(false);
  }

  public click(time_msec?: number) {
    this.on();
    if (typeof time_msec !== "number") {
      time_msec = 100;
    }
    this.obniz.wait(time_msec);
    this.off();
  }

  public doubleClick(time_msec?: number) {
    if (typeof time_msec !== "number") {
      time_msec = 100;
    }
    this.click(time_msec);
    this.obniz.wait(time_msec);
    this.click(time_msec);
  }
}
