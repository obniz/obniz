/**
 * @packageDocumentation
 * @module Parts.IPM-165
 */

import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface IPM_165Options {
  signal: number;
  vcc?: number;
  gnd?: number;
}

export default class IPM_165 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "IPM-165",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public signal!: PeripheralAD;
  public onchange?: (value: number) => void;

  protected obniz!: Obniz;

  constructor() {
    this.keys = ["signal", "vcc", "gnd"];
    this.requiredKeys = ["signal"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.signal = this.obniz.getAD(this.params.signal);
    this.signal.start((value: number) => {
      if (this.onchange) {
        this.onchange(value);
      }
    });
  }

  public async getWait(): Promise<number> {
    return await this.signal.getWait();
  }
}
