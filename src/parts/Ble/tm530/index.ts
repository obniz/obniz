/**
 * @packageDocumentation
 * @module Parts.TM530
 */

import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";

export interface TM530Options {}

export interface TM530_Data {
  battery: number;
  temperature: number;
  humidity: number;
}

export default class TM530 implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: "TM530",
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

  public static getData(peripheral: BleRemotePeripheral): TM530_Data | null {
    if (!TM530.isDevice(peripheral)) {
      return null;
    }
    const data: TM530_Data = {
      battery: peripheral.adv_data[13],
      temperature: peripheral.adv_data[14] + ObnizPartsBleInterface.readFraction(peripheral.adv_data[15]),
      humidity: peripheral.adv_data[16] + ObnizPartsBleInterface.readFraction(peripheral.adv_data[17]),
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
    -1,
    0x01,
    -1,
    -1,
    -1,
    -1,
    -1,
  ];

  public _peripheral: BleRemotePeripheral | null = null;

  constructor() {}
}
