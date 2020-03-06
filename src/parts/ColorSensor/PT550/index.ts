/**
 * @packageDocumentation
 * @module Parts.PT550
 */

import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface PT550Options {
  signal: number;
  vcc?: number;
  gnd?: number;
}

export default class PT550 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "PT550",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public obniz!: Obniz;
  public params: any;
  public signal!: PeripheralAD;

  constructor() {
    this.keys = ["signal", "vcc", "gnd"];
    this.requiredKeys = ["signal"];
  }

  public onchange(value: number) {}

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.signal = this.obniz.getAD(this.params.signal);
    this.signal.start((value: any) => {
      if (this.onchange) {
        this.onchange(value);
      }
    });
  }

  public async getWait(): Promise<number> {
    return await this.signal.getWait();
  }
}
