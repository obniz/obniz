/**
 * @packageDocumentation
 * @module Parts.Keyestudio_MoistureSensor
 */

import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface Keyestudio_MoistureSensorOptions {
  vcc?: number;
  signal: number;
  gnd?: number;
}

export default class Keyestudio_MoistureSensor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Keyestudio_MoistureSensor",
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
    this.keys = ["vcc", "signal", "gnd"];
    this.requiredKeys = ["signal"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    this.ad = obniz.getAD(this.params.signal);

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
