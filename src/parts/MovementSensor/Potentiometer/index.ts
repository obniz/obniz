/**
 * @packageDocumentation
 * @module Parts.Potentiometer
 */

import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface PotentiometerOptions {
  pin0: number;
  pin1: number;
  pin2: number;
}

export default class Potentiometer implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Potentiometer",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public vcc_voltage = 5.0;
  public ad!: PeripheralAD;
  public position = 0;
  public onchange?: (position: number) => void;

  protected obniz!: Obniz;

  constructor() {
    this.keys = ["pin0", "pin1", "pin2"];
    this.requiredKeys = ["pin0", "pin1", "pin2"];
  }

  public wired(obniz: Obniz) {
    this.obniz.setVccGnd(this.params.pin0, this.params.pin2, "5v");
    this.ad = obniz.getAD(this.params.pin1);

    obniz.getAD(this.params.pin0).start((value: any) => {
      this.vcc_voltage = value;
    });

    this.ad.start((value: number) => {
      this.position = value / this.vcc_voltage;
      if (this.onchange) {
        this.onchange(this.position);
      }
    });
  }
}
