/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizBleBeaconStruct,
  ObnizPartsBleCompare,
  uintBE,
} from '../../../obniz/ObnizPartsBleAbstract';
import Logtta from '../utils/abstracts/Logtta';

export interface Logtta_CO2Options {}

export interface Logtta_CO2_Data {
  co2: number;
  battery: number;
  interval: number;
  address: string; // TODO: delete
}

export type Logtta_CO2_Connected_Data = number;

export default class Logtta_CO2 extends Logtta<
  Logtta_CO2_Data,
  Logtta_CO2_Connected_Data
> {
  public static readonly PartsName = 'Logtta_CO2';

  public static readonly ServiceUuids = {
    Connectable: '31f3ab20-bd1c-46b1-91e4-f57abcf7d449',
    Beacon: null,
  };

  public static readonly BeaconDataStruct: ObnizPartsBleCompare<ObnizBleBeaconStruct<Logtta_CO2_Data> | null> = {
    Connectable: null,
    Beacon: {
      appearance: {
        index: 0,
        type: 'check',
        data: 0x02,
      },
      co2: {
        index: 1,
        length: 2,
        type: 'unsignedNumBE',
      },
      battery: {
        index: 5,
        type: 'unsignedNumBE',
      },
      interval: {
        index: 6,
        length: 2,
        type: 'unsignedNumBE',
      },
      /* alert: {
        index: 8,
        type: 'uint8',
      },
      name: {
        index: 9,
        length: 15,
        type: 'string',
      } */
      // TODO: delete
      address: {
        index: 0,
        type: 'custom',
        func: (data, peripheral) => peripheral.address,
      },
    },
  };

  /** @deprecated */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return this.getDeviceMode(peripheral) === 'Connectable';
  }

  /** @deprecated */
  public static isAdvDevice(peripheral: BleRemotePeripheral): boolean {
    return this.getDeviceMode(peripheral) === 'Beacon';
  }

  protected readonly staticClass = Logtta_CO2;

  /** @deprecated */
  public async getWait(): Promise<number | null> {
    try {
      return await this.getDataWait();
    } catch {
      return null;
    }
  }

  /** @deprecated */
  public setBeaconMode(enable: boolean): Promise<boolean> {
    return this.setBeaconModeWait(enable);
  }

  protected parseData(data: number[]): Logtta_CO2_Connected_Data {
    return uintBE(data);
  }
}
