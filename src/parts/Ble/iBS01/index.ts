/**
 * @packageDocumentation
 * @module Parts.iBS01
 */

import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";

export interface IBS01Options {}

export interface IBS01_Data {
  battery: number;
  button: boolean;
  moving: boolean;
  hall_sensor: boolean;
  fall: boolean;
}

export default class IBS01 implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: "iBS01",
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
    return (
      peripheral.adv_data[12] === 0xff &&
      peripheral.adv_data[13] === 0xff &&
      peripheral.adv_data[14] === 0xff &&
      peripheral.adv_data[15] === 0xff
    );
  }

  public static getData(peripheral: BleRemotePeripheral): IBS01_Data | null {
    if (!IBS01.isDevice(peripheral)) {
      return null;
    }
    const data: IBS01_Data = {
      battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
      button: false,
      moving: false,
      hall_sensor: false,
      fall: false,
    };

    if (Boolean(peripheral.adv_data[11] & 0b0001)) {
      data.button = true;
    }
    if (Boolean(peripheral.adv_data[11] & 0b0010)) {
      data.moving = true;
    }
    if (Boolean(peripheral.adv_data[11] & 0b0100)) {
      data.hall_sensor = true;
    }
    if (Boolean(peripheral.adv_data[11] & 0b1000)) {
      data.fall = true;
    }
    return data;
  }

  private static deviceAdv: number[] = [
    0x02,
    0x01,
    0x06,
    0x12,
    0xff,
    0x59, // Manufacturer vendor code
    0x00, // Manufacturer vendor code
    0x80, // Magic code
    0xbc, // Magic code
    -1, // Battery
    -1, // Battery
    -1, // Event
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // reserved
  ];

  public _peripheral: BleRemotePeripheral | null = null;

  constructor() {}
}
