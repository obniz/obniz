/**
 * @packageDocumentation
 * @module Parts.Logtta_AD
 */
/* eslint rulesdir/non-ascii: 0 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizBleBeaconStruct,
  ObnizPartsBleCompare,
  uint,
  uintBE,
} from '../../../obniz/ObnizPartsBleAbstract';
import Logtta from '../utils/abstracts/Logtta';

export interface Logtta_ADOptions {}

/**
 * data from Logtta_AD
 *
 * Logtta_ADからの受け取ったデータ
 */
export interface Logtta_AD_Data extends Logtta_AD_Connected_Data {
  /**
   * remaining battery 電池残量
   *
   * Range 範囲: 0~100 (Unit 単位: 1 %)
   *
   * 254: USB power supply USB給電
   */
  battery: number;
  /**
   * measurement interval 測定周期
   *
   * Range 範囲: 1~2100 (Unit 単位: 1 s)
   */
  interval: number;
}

/**
 * the current value and voltage value data from Logtta_AD
 *
 * Logtta_ADからの電流電圧受け取ったデータ
 */
export interface Logtta_AD_Connected_Data {
  /**
   * 電流値 current value
   *
   * Range 範囲: 4~20 (Unit 単位: 1 mA)
   */
  ampere: number;
  /**
   * 電圧値 voltage value
   *
   * Range 範囲: 1~5 (Unit 単位: 1 mV)
   */
  volt: number;
  /** count data カウントデータ */
  count: number;
}

/** Logtta_AD management class Logtta_ADを管理するクラス */
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

  /**
   * @deprecated
   *
   * Verify that the received peripheral is from the Logtta_AD
   *
   * 受け取ったPeripheralがLogtta_ADのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the Logtta_AD
   *
   * Logtta_ADかどうか
   */
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

  /**
   * Get the current value from the Logtta_AD
   *
   * Logtta_ADから電流値を取得
   *
   * @returns the current value from the Logtta_AD
   *
   * Logtta_ADから受け取った電流値
   */
  public async getAmpereWait(): Promise<number> {
    return (await this.getDataWait()).ampere;
  }

  /**
   * Get the voltage value from the Logtta_AD
   *
   * Logtta_ADから電圧値を取得
   *
   * @returns the voltage value from the Logtta_AD
   *
   * Logtta_ADから受け取った電圧値
   */
  public async getVoltWait(): Promise<number> {
    return (await this.getDataWait()).volt;
  }

  /**
   * Get the count data from the Logtta_AD
   *
   * Logtta_ADからカウントデータを取得
   *
   * @returns the count data from the Logtta_AD
   *
   * Logtta_ADから受け取ったカウントデータ
   */
  public async getCountWait(): Promise<number> {
    return (await this.getDataWait()).count;
  }

  /**
   * @deprecated
   *
   * Get all data available from the Logtta_AD
   *
   * Logtta_ADから取得可能なデータを全て取得
   *
   * @returns all data available from the Logtta_AD
   *
   * Logtta_ADから受け取った全てのデータ
   */
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
