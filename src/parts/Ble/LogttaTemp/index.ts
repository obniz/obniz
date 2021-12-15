/**
 * @packageDocumentation
 * @module Parts.Logtta_TH
 */
/* eslint rulesdir/non-ascii: 0 */

import { deprecate } from 'util';
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

/**
 * data from Logtta_TH(Logtta_Temp)
 *
 * Logtta_TH(Logtta_Temp)からのデータ
 */
export interface Logtta_TH_Data extends Logtta_TH_Connected_Data {
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
  /** BLE address BLEアドレス */
  address: string; // TODO: delete
}

/**
 * temperature and humidity data from Logtta_TH(Logtta_Temp)
 *
 * Logtta_TH(Logtta_Temp)からの音湿度データ
 */
export interface Logtta_TH_Connected_Data {
  /**
   * temperature 温度
   *
   * Range 範囲: -20~60 (Unit 単位: degC)
   */
  temperature: number;
  /**
   * relative humidity 湿度
   *
   * Range 範囲 0~100 (Unit 単位: %RH)
   */
  humidity: number;
}

/**
 * Logtta_TH(Logtta_Temp) management class
 *
 * Logtta_TH(Logtta_Temp)を管理するクラス
 */
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

  /**
   * @deprecated
   *
   * Verify that the received peripheral is from the Logtta_TH(Logtta_Temp)
   *
   * 受け取ったPeripheralがLogtta_TH(Logtta_Temp)のものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the Logtta_TH(Logtta_Temp)
   *
   * Logtta_TH(Logtta_Temp)かどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return this.getDeviceMode(peripheral) === 'Connectable';
  }

  /**
   * @deprecated
   *
   * Verify that the received advertisement is from the Logtta_TH(Logtta_Temp) (in Beacon Mode)
   *
   * 受け取ったAdvertisementがLogtta_TH(Logtta_Temp)のものかどうか確認する(ビーコンモード中)
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the Logtta_TH(Logtta_Temp)
   *
   * Logtta_TH(Logtta_Temp)かどうか
   */
  public static isAdvDevice(peripheral: BleRemotePeripheral): boolean {
    return this.getDeviceMode(peripheral) === 'Beacon';
  }

  protected readonly staticClass = Logtta_TH;

  /**
   * @deprecated
   *
   * Get all data with connected state
   *
   * 接続している状態で全てのデータを取得
   *
   * @returns all data from the Logtta_TH(Logtta_Temp)
   *
   * Logtta_TH(Logtta_Temp)から受け取った全てのデータ
   */
  public async getAllWait(): Promise<Logtta_TH_Connected_Data | null> {
    try {
      return await this.getDataWait();
    } catch {
      return null;
    }
  }

  /**
   * Get the temperature data with connected state
   *
   * 接続している状態で温度のデータを取得
   *
   * @returns temperature data from the Logtta_TH(Logtta_Temp)
   *
   * Logtta_TH(Logtta_Temp)から受け取った温度データ
   */
  public async getTemperatureWait(): Promise<number> {
    return (await this.getDataWait()).temperature;
  }

  /**
   * Get the humidity data with connected state
   *
   * 接続している状態で湿度のデータを取得
   *
   * @returns humidity data from the Logtta_TH(Logtta_Temp)
   *
   * Logtta_TH(Logtta_Temp)から受け取った湿度データ
   */
  public async getHumidityWait(): Promise<number> {
    return (await this.getDataWait()).humidity;
  }

  /**
   * @deprecated
   *
   * Set enable / disable for beacon mode (periodic beacon transmission)
   *
   * Call this function after authenticating with the sensor
   *
   * After setting, disconnect once to enable it
   *
   * To stop beacon mode, you need to hold the button on the sensor for more than 2 seconds
   *
   * (For more detail, please see http://www.uni-elec.co.jp/logtta_page.html )
   *
   * ビーコンモード(定期的なビーコン発信)の有効/無効の設定
   *
   * センサとの認証を済ませた状態で実行してください
   *
   * 設定後に切断した後から有効になります
   *
   * ビーコンモードの終了は、デバイスのボタンを2秒以上長押しする操作が必要です(詳しくは http://www.uni-elec.co.jp/logtta_page.html )
   *
   * @param enable enable the beacon mode or not ビーコンモードを有効にするかどうか
   *
   * @returns
   */
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
