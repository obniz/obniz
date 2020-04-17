/**
 * @packageDocumentation
 * @module Parts.iBS01T
 */

import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";

export interface IBS01TOptions {}

export interface IBS01T_Data {
  button: boolean;
  moving: boolean;
  reed: boolean;
  battery: number;
  temperature: number;
  humidity: number;
}

export default class IBS01T implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: "iBS01T",
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
    return !(
      peripheral.adv_data[12] === 0xff &&
      peripheral.adv_data[13] === 0xff &&
      peripheral.adv_data[14] === 0xff &&
      peripheral.adv_data[15] === 0xff
    );
  }

  public static getData(peripheral: BleRemotePeripheral): IBS01T_Data | null {
    if (!IBS01T.isDevice(peripheral)) {
      return null;
    }
    const d: IBS01T_Data = {
      button: false,
      moving: false,
      reed: false,
      battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
      temperature: ObnizPartsBleInterface.signed16FromBinary(peripheral.adv_data[13], peripheral.adv_data[12]) * 0.01,
      humidity: ObnizPartsBleInterface.signed16FromBinary(peripheral.adv_data[15], peripheral.adv_data[14]),
    };

    if (Boolean(peripheral.adv_data[11] & 0b0001)) {
      d.button = true;
    }
    if (Boolean(peripheral.adv_data[11] & 0b0010)) {
      d.moving = true;
    }
    if (Boolean(peripheral.adv_data[11] & 0b0100)) {
      d.reed = true;
    }
    return d;
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
    -1, // temp
    -1, // temp
    -1, // humid
    -1, // humid
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
