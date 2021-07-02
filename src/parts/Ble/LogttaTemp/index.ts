/**
 * @packageDocumentation
 * @module Parts.Logtta_TH
 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizBleBeaconStruct,
  ObnizPartsBleCompare,
  ObnizPartsBleMode,
  uint,
  uintBE,
} from '../../../obniz/ObnizPartsBleAbstract';
import Logtta from '../utils/abstracts/Logtta';

export interface Logtta_THOptions {}

export interface Logtta_TH_Data extends Logtta_TH_Connected_Data {
  battery: number;
  interval: number;
  address: string; // TODO: delete
}

export interface Logtta_TH_Connected_Data {
  temperature: number;
  humidity: number;
}

export default class Logtta_TH extends Logtta<
  Logtta_TH_Data,
  Logtta_TH_Connected_Data
> {
  public static readonly PartsName = 'Logtta_TH';

  public static readonly AvailableBleMode: ObnizPartsBleMode[] = [
    'Connectable',
    'Beacon',
  ];

  public static readonly LocalName = {
    Connectable: undefined,
    Beacon: /null/,
  };

  public static readonly ServiceUuids = {
    Connectable: 'f7eeaa20-276e-4165-aa69-7e3de7fc627e',
    Beacon: null,
  };

  public static readonly BeaconDataStruct: ObnizPartsBleCompare<ObnizBleBeaconStruct<Logtta_TH_Data> | null> = {
    Connectable: null,
    Beacon: {
      appearance: {
        index: 0,
        type: 'check',
        data: 0x01,
      },
      temperature: {
        index: 1,
        length: 2,
        type: 'custom',
        func: (data) => Logtta_TH.parseTemperatureData(data, uintBE),
      },
      humidity: {
        index: 3,
        length: 2,
        type: 'custom',
        func: (data) => Logtta_TH.parseHumidityData(data, uintBE),
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
        index: 7,
        type: 'uint8',
      },
      name: {
        index: 8,
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

  protected static parseTemperatureData(data: number[], func = uint): number {
    return (func(data) / 0x10000) * 175.72 - 46.85;
  }

  protected static parseHumidityData(data: number[], func = uint): number {
    return (func(data) / 0x10000) * 125 - 6;
  }

  /** @deprecated */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return this.getDeviceMode(peripheral) === 'Connectable';
  }

  /** @deprecated */
  public static isAdvDevice(peripheral: BleRemotePeripheral): boolean {
    return this.getDeviceMode(peripheral) === 'Beacon';
  }

  protected readonly staticClass = Logtta_TH;

  /** @deprecated */
  public async getAllWait(): Promise<Logtta_TH_Connected_Data | null> {
    try {
      return await this.getDataWait();
    } catch {
      return null;
    }
  }

  public async getTemperatureWait(): Promise<number> {
    return (await this.getDataWait()).temperature;
  }

  public async getHumidityWait(): Promise<number> {
    return (await this.getDataWait()).humidity;
  }

  /** @deprecated */
  public setBeaconMode(enable: boolean): Promise<boolean> {
    return this.setBeaconModeWait(enable);
  }

  protected parseData(data: number[]): Logtta_TH_Connected_Data {
    return {
      temperature: Logtta_TH.parseTemperatureData(data.slice(0, 2)),
      humidity: Logtta_TH.parseHumidityData(data.slice(2, 4)),
    };
  }
}
