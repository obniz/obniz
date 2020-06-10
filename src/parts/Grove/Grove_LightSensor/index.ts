/**
 * @packageDocumentation
 * @module Parts.Grove_LightSensor
 */

import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";
import PeripheralGrove from "../../../obniz/libs/io_peripherals/grove";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

interface Grove_LightSensorOptionsA {
  vcc?: number;
  gnd?: number;
  signal: number;
}

interface Grove_LightSensorOptionsB {
  grove: PeripheralGrove;
}

export type Grove_LightSensorOptions = Grove_LightSensorOptionsA | Grove_LightSensorOptionsB;

export default class Grove_LightSensor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Grove_LightSensor",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public ad!: PeripheralAD;

  protected obniz!: Obniz;

  constructor() {
    this.keys = ["vcc", "gnd", "signal", "grove"];
    this.requiredKeys = [];
  }

  public onchange(value: number) {}

  public wired(obniz: Obniz) {
    if (this.params.grove) {
      const groveAd = this.params.grove.getAnalog();
      this.ad = groveAd.primary;
    } else {
      this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
      this.ad = obniz.getAD(this.params.signal);
    }
    this.ad.start((value: any) => {
      if (this.onchange) {
        this.onchange(value);
      }
    });
  }

  public async getWait(): Promise<number> {
    return await this.ad.getWait();
  }
}
