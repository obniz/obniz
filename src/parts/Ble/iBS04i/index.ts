/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */

import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";

export interface IBS04IOptions {}

export interface IBS04I_Data {
  battery: number;
  button: boolean;
  uuid: string;
  major: number;
  minor: number;
  power: number;
  rssi: number;
  address: string;
}

export default class IBS04I implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: "iBS04i",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return IBS04I.getDeviceArray(peripheral) !== null;
  }

  public static getData(peripheral: BleRemotePeripheral): IBS04I_Data | null {
    const adv = IBS04I.getDeviceArray(peripheral);
    if (adv === null) {
      return null;
    }
    const data: IBS04I_Data = {
      battery: (adv[5] + adv[6] * 256) * 0.01,
      button: Boolean(adv[7]),
      uuid: peripheral.iBeacon!.uuid,
      major: peripheral.iBeacon!.major,
      minor: peripheral.iBeacon!.minor,
      power: peripheral.iBeacon!.power,
      rssi: peripheral.iBeacon!.rssi,
      address: peripheral.address,
    };
    return data;
  }

  private static deviceAdv: number[] = [
    0xff,
    0x0d, // Manufacturer vendor code
    0x00, // Manufacturer vendor code
    0x83, // Magic code
    0xbc, // Magic code
    -1, // Battery
    -1, // Battery
    -1, // Event
    0xff, // reserved
    0xff, // reserved
    0xff, // reserved
    0xff, // reserved
    0x00, // user
    -1, // user
    -1, // subType
    -1, // reserved
    -1, // reserved
    -1, // reserved
  ];

  private static getDeviceArray(peripheral: BleRemotePeripheral): number[] | null {
    const advertise = peripheral.advertise_data_rows.filter((adv: number[]) => {
      let find = false;
      if (this.deviceAdv.length > adv.length) {
        return find;
      }
      for (let index = 0; index < this.deviceAdv.length; index++) {
        if (this.deviceAdv[index] === -1) {
          continue;
        }
        if (adv[index] === this.deviceAdv[index]) {
          find = true;
          continue;
        }
        find = false;
        break;
      }
      return find;
    });
    if (advertise.length !== 1) {
      return null;
    }
    const type = advertise[0][14];
    if (type !== 24) {
      // iBS04i以外
      return null;
    }
    return advertise[0];
  }

  public _peripheral: BleRemotePeripheral | null = null;

  constructor() {}
}
