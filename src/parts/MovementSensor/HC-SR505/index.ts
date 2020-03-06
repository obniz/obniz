/**
 * @packageDocumentation
 * @module Parts.HC-SR505
 */

import Obniz from "../../../obniz";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface HCSR505Options {
  signal: number;
  vcc?: number;
  gnd?: number;
}

export default class HCSR505 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "HC-SR505",
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

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");

    this.io_signal.input((value: any) => {
      if (this.onchange) {
        this.onchange(value);
      }
    });
  }

  public async getWait(): Promise<boolean> {
    return await this.io_signal.inputWait();
  }
}
