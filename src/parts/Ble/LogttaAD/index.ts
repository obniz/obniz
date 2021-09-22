/**
 * @packageDocumentation
 * @module Parts.Logtta_AD
 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizBleBeaconStruct,
  ObnizPartsBleCompare,
  uint,
  uintBE,
} from '../../../obniz/ObnizPartsBleAbstract';
import Logtta from '../utils/abstracts/Logtta';

export interface Logtta_ADOptions {}

export interface Logtta_AD_Data extends Logtta_AD_Connected_Data {
  battery: number;
  interval: number;
}

export interface Logtta_AD_Connected_Data {
  ampere: number;
  volt: number;
  count: number;
}

export default class Logtta_AD extends Logtta<
  Logtta_AD_Data,
  Logtta_AD_Connected_Data
> {
  public static readonly PartsName = 'Logtta_AD';

  public static readonly ServiceUuids = {
    Connectable: '4e43ae20-6687-4f3c-a1c3-1c327583f29d',
    Beacon: null,
  };

  public static readonly BeaconDataStruct: ObnizPartsBleCompare<ObnizBleBeaconStruct<Logtta_AD_Data> | null> = {
    Connectable: null,
    Beacon: {
      appearance: {
        index: 0,
        type: 'check',
        data: 0x04,
      },
      ampere: {
        index: 1,
        length: 2,
        type: 'custom',
        func: (data) => Logtta_AD.parseAmpereData(data, uintBE),
      },
      volt: {
        index: 1,
        length: 2,
        type: 'custom',
        func: (data) => Logtta_AD.parseVoltData(data, uintBE),
      },
      count: {
        index: 3,
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
    },
  };

  /** @deprecated */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return this.getDeviceMode(peripheral) === 'Connectable';
  }

  protected static parseAmpereData(data: number[], func = uint): number {
    return (16 / 916) * func(data);
  }

  protected static parseVoltData(data: number[], func = uint): number {
    return (4 / 916) * func(data);
  }

  protected readonly staticClass = Logtta_AD;

  public async getAmpereWait(): Promise<number> {
    return (await this.getDataWait()).ampere;
  }

  public async getVoltWait(): Promise<number> {
    return (await this.getDataWait()).volt;
  }

  public async getCountWait(): Promise<number> {
    return (await this.getDataWait()).count;
  }

  /** @deprecated */
  public async getAllWait(): Promise<Logtta_AD_Connected_Data | null> {
    try {
      return await this.getDataWait();
    } catch {
      return null;
    }
  }

  protected parseData(data: number[]): Logtta_AD_Connected_Data {
    return {
      ampere: this.staticClass.parseAmpereData(data.slice(0, 2), uintBE),
      volt: this.staticClass.parseVoltData(data.slice(0, 2), uintBE),
      count: uintBE(data.slice(2, 4)),
    };
  }
}
