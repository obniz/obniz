/**
 * @packageDocumentation
 * @module Parts
 */

import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

/**
 * @category Parts
 */
export interface  YG1006Options {
  signal: number;
  vcc?: number;
  gnd?: number;
}

/**
 * @category Parts
 */
export default class YG1006 implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "YG1006",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public onchange: ((value: number) => void) | null = null;

  protected obniz!: Obniz;

  private signal!: PeripheralAD;

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

  public async getWait() {
    return await this.signal.getWait();
  }
}
