/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface IBS03ROptions {}

export interface IBS03R_Data {
  battery: number;
  button: boolean;
  distance: number;
  address: string;
}

export default class IBS03R implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'iBS03R',
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return IBS03R.getDeviceArray(peripheral) !== null;
  }

  public static getData(peripheral: BleRemotePeripheral): IBS03R_Data | null {
    const adv = IBS03R.getDeviceArray(peripheral);
    if (adv === null) {
      return null;
    }

    const data: IBS03R_Data = {
      battery: (adv[5] + adv[6] * 256) * 0.01,
      button: Boolean(adv[7]),
      distance: adv[10] + adv[11] * 256,
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
    -1, // reserved
    -1, // reserved
    -1, // distance
    -1, // distance
    -1, // user
    -1, // user
    0x13, // subType
    -1, // reserved
    -1, // reserved
    -1, // reserved
  ];

  private static getDeviceArray(
    peripheral: BleRemotePeripheral
  ): number[] | null {
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
    return advertise[0];
  }

  public _peripheral: BleRemotePeripheral | null = null;
}
