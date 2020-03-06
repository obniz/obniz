/**
 * @packageDocumentation
 * @module Parts.GP2Y0A21YK0F
 */

import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface GP2Y0A21YK0FOptions {
  vcc?: number;
  gnd?: number;
  signal: number;
}

export type GP2Y0A21YK0FUnitType = "mm" | "inch";

export default class GP2Y0A21YK0F implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "GP2Y0A21YK0F",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public displayIoNames = {
    vcc: "vcc",
    gnd: "gnd",
    signal: "signal",
  };
  public _unit: GP2Y0A21YK0FUnitType = "mm";
  public obniz!: Obniz;
  public params: any;
  public ad_signal!: PeripheralAD;

  constructor() {
    this.keys = ["vcc", "gnd", "signal"];
    this.requiredKeys = ["signal"];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
    const io_signal = obniz.getIO(this.params.signal);
    io_signal.end();
    this.ad_signal = obniz.getAD(this.params.signal);
  }

  public start(callback: (distance: number) => void) {
    this.ad_signal.start((val: number) => {
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
        const val = await this.ad_signal.getWait();
        const distance = this._volt2distance(val);
        resolve(distance);
      } catch (e) {
        reject(e);
      }
    });
  }

  public unit(unit: GP2Y0A21YK0FUnitType) {
    if (unit === "mm") {
      this._unit = "mm";
    } else if (unit === "inch") {
      this._unit = "inch";
    } else {
      throw new Error("unknown unit " + unit);
    }
  }
}
