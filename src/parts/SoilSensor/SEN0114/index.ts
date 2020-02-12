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
export interface  SEN0114Options {
  vcc?: number;
  output: number;
  gnd?: number;
}

/**
 * @category Parts
 */
export default class SEN0114 implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "SEN0114",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public value: any;
  public onchange?: (value: number) => void;

  protected obniz!: Obniz;

  private ad!: PeripheralAD;

  constructor() {
    this.keys = ["vcc", "output", "gnd"];
    this.requiredKeys = ["output"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.ad = obniz.getAD(this.params.output);

    this.ad.start((value: number) => {
      this.value = value;
      if (this.onchange) {
        this.onchange(this.value);
      }
    });
  }

  public async getHumidityWait() {
    return await this.ad.getWait();
  }
}
