/**
 * @packageDocumentation
 * @module Parts.FSR40X
 */

import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

// Todo: add weight and calc pressure(kg)

export interface FSR40XOptions {
  pin0: number;
  pin1: number;
}

export default class FSR40X implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "FSR40X",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public pressure = 0;
  public onchange?: (temp: number) => void;

  protected obniz!: Obniz;

  private io_pwr!: PeripheralIO;
  private ad!: PeripheralAD;

  constructor() {
    this.keys = ["pin0", "pin1"];
    this.requiredKeys = ["pin0", "pin1"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    this.io_pwr = obniz.getIO(this.params.pin0);
    this.ad = obniz.getAD(this.params.pin1);

    this.io_pwr.drive("5v");
    this.io_pwr.output(true);

    this.ad.start((value: number) => {
      const pressure: any = value * 100;
      this.pressure = pressure;
      if (this.onchange) {
        this.onchange(this.pressure);
      }
    });
  }

  public async getWait(): Promise<number> {
    const value = await this.ad.getWait();
    const pressure = value * 100;
    this.pressure = pressure;
    return this.pressure;
  }
}
