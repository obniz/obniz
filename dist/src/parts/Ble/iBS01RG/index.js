"use strict";
//
//   const accelArray: IBS01RG_Acceleration_Data[] = [];
//   for (let i = 0; i < 3; i++) {
//     accelArray.push({
//       x: IBS01RG.signed16FromBinary(advertise[0][7 + i * 6], advertise[0][8 + i * 6]),
//       y: IBS01RG.signed16FromBinary(advertise[0][9 + i * 6], advertise[0][10 + i * 6]),
//       z: IBS01RG.signed16FromBinary(advertise[0][11 + i * 6], advertise[0][12 + i * 6]),
//     });
//   }
//   console.log((advertise[0][6] & 0x0f) * 0xff);
//   console.log((advertise[0][6] & 0x30) >> 4);
//   const data: IBS01RG_Data = {
//     battery: (advertise[0][5] + (advertise[0][6] & 0x0f) * 256) * 0.01,
//     active: Boolean((advertise[0][6] & 0x10) >> 4),
//     button: Boolean((advertise[0][6] & 0x20) >> 5),
//     acceleration: accelArray,
//     address: peripheral.address,
//   };
//   // console.log(`battery ${data.battery}V event ${data.event});
//   if (this.onNotification) {
//     this.onNotification(data);
//   }
//
//   if (this.onChangeButton) {
//     const button: boolean = Boolean((advertise[0][6] & 0x20) >> 5);
//     if (button !== this.oldButtonFlg) {
//       this.onChangeButton(button, peripheral.address);
//       this.oldButtonFlg = button;
//     }
//   }
//
//   if (this.onChangeActive) {
//     const actived: boolean = Boolean((advertise[0][6] & 0x10) >> 4);
//     if (actived !== this.oldActiveFlg) {
//       this.onChangeActive(actived, peripheral.address);
//       this.oldActiveFlg = actived;
//     }
//   }
// };
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleInterface_1 = __importDefault(require("../../../obniz/ObnizPartsBleInterface"));
class IBS01RG {
    constructor() {
        this._peripheral = null;
    }
    static info() {
        return {
            name: "iBS01RG",
        };
    }
    static isDevice(peripheral) {
        if (this.deviceAdv.length > peripheral.adv_data.length) {
            return false;
        }
        for (let index = 0; index < this.deviceAdv.length; index++) {
            if (this.deviceAdv[index] === -1) {
                continue;
            }
            if (peripheral.adv_data[index] === this.deviceAdv[index]) {
                continue;
            }
            return false;
        }
        return true;
    }
    static getData(peripheral) {
        if (!IBS01RG.isDevice(peripheral)) {
            return null;
        }
        const accelArray = [];
        for (let i = 0; i < 3; i++) {
            accelArray.push({
                x: ObnizPartsBleInterface_1.default.signed16FromBinary(peripheral.adv_data[12 + i * 6], peripheral.adv_data[11 + i * 6]),
                y: ObnizPartsBleInterface_1.default.signed16FromBinary(peripheral.adv_data[14 + i * 6], peripheral.adv_data[13 + i * 6]),
                z: ObnizPartsBleInterface_1.default.signed16FromBinary(peripheral.adv_data[16 + i * 6], peripheral.adv_data[15 + i * 6]),
            });
        }
        const data = {
            battery: (peripheral.adv_data[9] + (peripheral.adv_data[10] & 0x0f) * 256) * 0.01,
            active: Boolean((peripheral.adv_data[10] & 0x10) >> 4),
            button: Boolean((peripheral.adv_data[10] & 0x20) >> 5),
            acceleration: accelArray,
        };
        return data;
    }
}
exports.default = IBS01RG;
IBS01RG.deviceAdv = [
    0x02,
    0x01,
    0x06,
    0x19,
    0xff,
    0x59,
    0x00,
    0x81,
    0xbc,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
];
