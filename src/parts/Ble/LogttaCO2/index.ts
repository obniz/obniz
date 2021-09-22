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

export interface Logtta_CO2_Data extends Logtta_CO2_Connected_Data {
  battery: number;
  interval: number;
  address: string; // TODO: delete
}

export interface Logtta_CO2_Connected_Data {
  co2: number;
}

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

  // TODO: delete
  // In order to maintain compatibility, when callback is placed from arguments, the behavior of the document street
  protected callbackFlag = false;

  public async startNotifyWait(
    callback: (data: Logtta_CO2_Connected_Data) => void
  ): Promise<void> {
    // TODO: delete try-catch
    try {
      this.checkConnected();
    } catch (e) {
      console.error(e);
      return;
    }

    // TODO: delete if
    if (callback) {
      this.callbackFlag = true;
      this.onNotify = callback;
    }
    return await this.subscribeWait(
      this.serviceUuid,
      this.getCharUuid(0x21),
      (data: number[]) => {
        if (this.onNotify) {
          if (this.callbackFlag) this.onNotify(this.parseData(data));
          else
            this.onNotify(
              (this.parseData(data).co2 as unknown) as Logtta_CO2_Connected_Data
            );
        }
      }
    );
  }

  /** @deprecated */
  public async getWait(): Promise<number | null> {
    try {
      return (await this.getDataWait()).co2;
    } catch {
      return null;
    }
  }

  /** @deprecated */
  public setBeaconMode(enable: boolean): Promise<boolean> {
    return this.setBeaconModeWait(enable);
  }

  protected parseData(data: number[]): Logtta_CO2_Connected_Data {
    return {
      co2: uintBE(data),
    };
  }
}
