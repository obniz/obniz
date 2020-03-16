/**
 * @packageDocumentation
 * @module Parts..Grove_DistanceSensor
 */

import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";
import PeripheralGrove from "../../../obniz/libs/io_peripherals/grove";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

interface Grove_DistanceSensorOptionsA {
  gnd?: number;
  vcc?: number;
  signal: number;
}

interface Grove_DistanceSensorOptionsB {
  grove: PeripheralGrove;
}

export type Grove_DistanceSensorUnitType = "mm" | "inch";

export type Grove_DistanceSensorOptions = Grove_DistanceSensorOptionsA | Grove_DistanceSensorOptionsB;

export default class Grove_DistanceSensor implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "Grove_DistanceSensor",
    };
  }

  public requiredKeys: string[];
  public keys: string[];
  public params: any;

  public _unit: Grove_DistanceSensorUnitType = "mm";
  public ad!: PeripheralAD;
  protected obniz!: Obniz;

  constructor() {
    this.keys = ["vcc", "gnd", "signal", "grove"];
    this.requiredKeys = [];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
    if (this.params.grove) {
      const groveAd = this.params.grove.getAnalog();
      this.ad = groveAd.primary;
      console.log(this.ad);
    } else {
      this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
      this.ad = obniz.getAD(this.params.signal);
    }
  }

  public start(callback: (distance: number) => void) {
    this.ad.start((val: number) => {
      const distance = this._volt2distance(val);
      if (typeof callback === "function") {
        callback(distance);
      }
    });
  }

  public _volt2distance(val: number): number {
    if (val <= 0) {
      val = 0.001;
    }

    let distance = 19988.34 * Math.pow((val / 5.0) * 1024, -1.25214) * 10;
    if (this._unit === "mm") {
      distance = Math.floor(distance * 10) / 10;
    } else {
      distance *= 0.0393701;
      distance = Math.floor(distance * 1000) / 1000;
    }
    return distance;
  }

  public getWait(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const val = await this.ad.getWait();
        const distance = this._volt2distance(val);
        resolve(distance);
      } catch (e) {
        reject(e);
      }
    });
  }

  public unit(unit: Grove_DistanceSensorUnitType) {
    if (unit === "mm") {
      this._unit = "mm";
    } else if (unit === "inch") {
      this._unit = "inch";
    } else {
      throw new Error("unknown unit " + unit);
    }
  }
}
