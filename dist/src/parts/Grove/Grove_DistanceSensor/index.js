"use strict";
/**
 * @packageDocumentation
 * @module Parts..Grove_DistanceSensor
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_DistanceSensor {
    constructor() {
        this._unit = "mm";
        this.keys = ["vcc", "gnd", "signal", "grove"];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: "Grove_DistanceSensor",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        if (this.params.grove) {
            const groveAd = this.params.grove.getAnalog();
            this.ad = groveAd.primary;
        }
        else {
            this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
            this.ad = obniz.getAD(this.params.signal);
        }
    }
    start(callback) {
        this.ad.start((val) => {
            const distance = this._volt2distance(val);
            if (typeof callback === "function") {
                callback(distance);
            }
        });
    }
    _volt2distance(val) {
        if (val <= 0) {
            val = 0.001;
        }
        let distance = 19988.34 * Math.pow((val / 5.0) * 1024, -1.25214) * 10;
        if (this._unit === "mm") {
            distance = Math.floor(distance * 10) / 10;
        }
        else {
            distance *= 0.0393701;
            distance = Math.floor(distance * 1000) / 1000;
        }
        return distance;
    }
    getWait() {
        return new Promise(async (resolve, reject) => {
            try {
                const val = await this.ad.getWait();
                const distance = this._volt2distance(val);
                resolve(distance);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    unit(unit) {
        if (unit === "mm") {
            this._unit = "mm";
        }
        else if (unit === "inch") {
            this._unit = "inch";
        }
        else {
            throw new Error("unknown unit " + unit);
        }
    }
}
exports.default = Grove_DistanceSensor;
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

//# sourceMappingURL=index.js.map
