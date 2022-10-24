/**
 * @packageDocumentation
 * @module Parts.TM530
 */
/* eslint rulesdir/non-ascii: 0 */

import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface TM530Options {}

/**
 * advertisement data from TM530
 *
 * TM530からのadvertisementデータ
 */
export interface TM530_Data {
  /**
   * battery バッテリー
   */
  battery: number;
  /**
   * temperature 温度
   */
  temperature: number;
  /**
   * humidity 湿度
   */
  humidity: number;
}

/** TM530 management class TM530を管理するクラス */
export default class TM530 implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'TM530',
    };
  }

  /**
   * Verify that the received peripheral is from the TM530
   *
   * 受け取ったPeripheralがTM530のものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the TM530
   *
   * TM530かどうか
   */
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

  /**
   * Get a data from the TM530
   *
   * TM530からデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the TM530 TM530から受け取ったデータ
   */
  public static getData(peripheral: BleRemotePeripheral): TM530_Data | null {
    if (!TM530.isDevice(peripheral)) {
      return null;
    }
    const data: TM530_Data = {
      battery: peripheral.adv_data[13],
      temperature:
        peripheral.adv_data[14] +
        ObnizPartsBleInterface.readFraction(peripheral.adv_data[15]),
      humidity:
        peripheral.adv_data[16] +
        ObnizPartsBleInterface.readFraction(peripheral.adv_data[17]),
    };
    return data;
  }

  private static deviceAdv: number[] = [
    0x02,
    0x01,
    0x06,
    0x03,
    0x03,
    0xe1,
    0xff,
    -1,
    -1,
    -1,
    -1,
    -1,
    0x01,
    -1,
    -1,
    -1,
    -1,
    -1,
  ];

  public _peripheral: BleRemotePeripheral | null = null;
}
