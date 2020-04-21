/**
 * @packageDocumentation
 * @module Parts.iBS03TP
 */

import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";

export interface IBS03TPOptions {}

export interface IBS03TP_Data {
  battery: number;
  button: boolean;
  moving: boolean;
  hall_sensor: boolean;
  temperature: number;
  probe_temperature: number;
}

export default class IBS03TP implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: "iBS03TP",
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

  public static getData(peripheral: BleRemotePeripheral): IBS03TP_Data | null {
    if (!IBS03TP.isDevice(peripheral)) {
      return null;
    }
    const data: IBS03TP_Data = {
      battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
      button: false,
      moving: false,
      hall_sensor: false,
      temperature: ObnizPartsBleInterface.signed16FromBinary(peripheral.adv_data[13], peripheral.adv_data[12]) * 0.01,
      probe_temperature:
        ObnizPartsBleInterface.signed16FromBinary(peripheral.adv_data[15], peripheral.adv_data[14]) * 0.01,
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
    return data;
  }

  private static deviceAdv: number[] = [
    0x02,
    0x01,
    0x06,
    0x12,
    0xff,
    0x0d, // Manufacturer vendor code
    0x00, // Manufacturer vendor code
    0x83, // Magic code
    0xbc, // Magic code
    -1, // Battery
    -1, // Battery
    -1, // Event
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // user
    -1, // user
    0x17, // subType
    -1, // reserved
    -1, // reserved
    -1, // reserved
  ];

  public _peripheral: BleRemotePeripheral | null = null;

  constructor() {}
}
