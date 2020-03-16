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

// /**
//  * @packageDocumentation
//  * @module Parts.Grove_RotaryAngleSensorOptionsA
//  */

// import Obniz from "../../../obniz";
// import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";
// import { DriveType } from "../../../obniz/libs/io_peripherals/common";
// import PeripheralGrove from "../../../obniz/libs/io_peripherals/grove";
// import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

// interface Grove_RotaryAngleSensorOptionsA {
//   signal: number;
//   vcc?: number;
//   gnd?: number;
// }

// interface Grove_RotaryAngleSensorOptionsB {
//   grove: PeripheralGrove;
// }

// export type Grove_RotaryAngleSensorOptions = Grove_RotaryAngleSensorOptionsA | Grove_RotaryAngleSensorOptionsB;

// export default class Grove_RotaryAngleSensor implements ObnizPartsInterface {
//   public static info(): ObnizPartsInfo {
//     return {
//       name: "Grove_RotaryAngleSensor",
//     };
//   }

//   public keys: string[];
//   public requiredKeys: string[];
//   public params: any;
//   public drive: DriveType;

//   // public vcc_voltage = 5.0;
//   public position = 0;
//   public ad!: PeripheralAD;
//   public value: any;
//   public onchange?: (position: number) => void;

//   protected obniz!: Obniz;

//   constructor() {
//     this.keys = ["vcc", "gnd", "signal", "grove"];
//     this.requiredKeys = [];
//     this.drive = "5v";
//   }

//   public wired(obniz: Obniz) {
//     if (this.params.grove) {
//       const groveAd = this.params.grove.getAnalog();
//       this.ad = groveAd.primary;
//     } else {
//       this.obniz.setVccGnd(this.params.vcc, this.params.gnd, this.drive);
//       this.ad = obniz.getAD(this.params.signal);
//     }

//     this.ad.start((value: number) => {
//       this.value = value;
//       if (this.onchange) {
//         this.onchange(this.value);
//       }
//     });
//   }
// }
