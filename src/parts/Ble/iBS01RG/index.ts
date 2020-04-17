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

/**
 * @packageDocumentation
 * @module Parts.iBS01RG
 */

import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";

export interface IBS01RGOptions {}

export interface IBS01RG_Acceleration_Data {
  x: number;
  y: number;
  z: number;
}

export interface IBS01RG_Data {
  battery: number;
  active: boolean;
  button: boolean;
  acceleration: IBS01RG_Acceleration_Data[];
}

export default class IBS01RG implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: "iBS01RG",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral): boolean {
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

  public static getData(peripheral: BleRemotePeripheral): IBS01RG_Data | null {
    if (!IBS01RG.isDevice(peripheral)) {
      return null;
    }
    const accelArray: IBS01RG_Acceleration_Data[] = [];
    for (let i = 0; i < 3; i++) {
      accelArray.push({
        x: ObnizPartsBleInterface.signed16FromBinary(peripheral.adv_data[12 + i * 6], peripheral.adv_data[11 + i * 6]),
        y: ObnizPartsBleInterface.signed16FromBinary(peripheral.adv_data[14 + i * 6], peripheral.adv_data[13 + i * 6]),
        z: ObnizPartsBleInterface.signed16FromBinary(peripheral.adv_data[16 + i * 6], peripheral.adv_data[15 + i * 6]),
      });
    }
    const data: IBS01RG_Data = {
      battery: (peripheral.adv_data[9] + (peripheral.adv_data[10] & 0x0f) * 256) * 0.01,
      active: Boolean((peripheral.adv_data[10] & 0x10) >> 4),
      button: Boolean((peripheral.adv_data[10] & 0x20) >> 5),
      acceleration: accelArray,
    };
    return data;
  }

  private static deviceAdv: number[] = [
    0x02,
    0x01,
    0x06,
    0x19,
    0xff,
    0x59, // Manufacturer vendor code
    0x00, // Manufacturer vendor code
    0x81, // Magic code
    0xbc, // Magic code
    -1, // Battery
    -1, // Battery
    -1, // x
    -1, // x
    -1, // y
    -1, // y
    -1, // z
    -1, // z
  ];

  public _peripheral: BleRemotePeripheral | null = null;

  constructor() {}
}
