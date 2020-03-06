/**
 * @packageDocumentation
 * @module Parts.Grove_EARTHOptionsA
 */

import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";
import PeripheralGrove from "../../../obniz/libs/io_peripherals/grove";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface Grove_EARTHOptionsA {
  vcc?: number;
  aout: number;
  dout: number;
  gnd?: number;
}

interface Grove_EARTHOptionsB {
  grove: PeripheralGrove;
}

export type Grove_EARTHOptions = Grove_EARTHOptionsA | Grove_EARTHOptionsB;

export default class Grove_EARTH implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Grove_EARTH",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public value: any;
  public onchange?: (value: number) => void;

  protected obniz!: Obniz;

  private ad!: PeripheralAD;
  private io!: PeripheralIO;

  constructor() {
    this.keys = ["vcc", "aout", "dout", "gnd", "grove"];
    this.requiredKeys = [];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    if (this.params.grove) {
      const groveIOs = this.params.grove.getAnalogDigital();
      this.ad = groveIOs.analog;
      this.io = groveIOs.digital;
    } else {
      this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
      this.ad = obniz.getAD(this.params.aout);
      this.io = obniz.getIO(this.params.dout);
    }

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

  public async getDigitalHumidityWait() {
    return await this.io.inputWait();
  }
}
