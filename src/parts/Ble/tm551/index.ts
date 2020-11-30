/**
 * @packageDocumentation
 * @module Parts.TM551
 */

import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";

export interface TM551Options {}

export interface TM551_Data {
  battery: number;
  x: number;
  y: number;
  z: number;
}

export default class TM551 implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: "TM551",
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

  public static getData(peripheral: BleRemotePeripheral): TM551_Data | null {
    if (!TM551.isDevice(peripheral)) {
      return null;
    }
    const data: TM551_Data = {
      battery: peripheral.adv_data[13],
      x: peripheral.adv_data[14] + ObnizPartsBleInterface.readFraction(peripheral.adv_data[15]),
      y: peripheral.adv_data[16] + ObnizPartsBleInterface.readFraction(peripheral.adv_data[17]),
      z: peripheral.adv_data[18] + ObnizPartsBleInterface.readFraction(peripheral.adv_data[19]),
    };
    return data;
  }

  private static deviceAdv: number[] = [
    0x02,
    0x01,
    0x06,
    0x03,
    0x03,
    0xe1,
    0xff,
    -1,
    -1,
    -1,
    -1,
    0xa1,
    0x03,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
  ];

  public _peripheral: BleRemotePeripheral | null = null;

  constructor() {}
}
