/**
 * @packageDocumentation
 * @module Parts.Keyestudio_PIR
 */

import Obniz from "../../../obniz";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface Keyestudio_PIROptions {
  signal: number;
  vcc?: number;
  gnd?: number;
}

export default class Keyestudio_PIR implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Keyestudio_PIR",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public io_signal!: PeripheralIO;
  public onchange?: (value: boolean) => void;

  protected obniz!: Obniz;

  constructor() {
    this.keys = ["vcc", "gnd", "signal"];
    this.requiredKeys = ["signal"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.io_signal = obniz.getIO(this.params.signal);
    this.io_signal.pull("0v");

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    this.io_signal.input((value: boolean) => {
      if (this.onchange) {
        this.onchange(value);
      }
    });
  }
}
