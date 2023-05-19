/**
 * @packageDocumentation
 * @module Parts.TA_temp01
 */
/* eslint rulesdir/non-ascii: 0 */

import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface TA_temp01Options {}

export interface TA_temp01Data {
  temperature: number;
  humidity: number;
  battery: number;
}

/** TA_temp01 management class TA_temp01を管理するクラス */
export default class TA_temp01 implements ObnizPartsBleInterface {
  public _peripheral: BleRemotePeripheral | null = null;

  public static info(): ObnizPartsBleInfo {
    return {
      name: 'TA-temp01',
    };
  }

  /**
   * Verify that the received peripheral is from the TA_temp01
   *
   * 受け取ったPeripheralがTA_temp01のものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the TA_temp01
   *
   * TA_temp01かどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return peripheral.localName === 'TA-temp01';
  }

  /**
   * Get a data from the TA_temp01
   *
   * TA_temp01からデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the TA_temp01 TA_temp01から受け取ったデータ
   */
  public static getData(peripheral: BleRemotePeripheral): TA_temp01Data | null {
    if (!TA_temp01.isDevice(peripheral)) {
      return null;
    }

    const temperature =
      Math.floor(
        Buffer.from([
          peripheral.adv_data[11],
          peripheral.adv_data[12],
        ]).readInt16BE(0) *
          0.1 *
          10
      ) / 10;
    const humidity = peripheral.adv_data[13];
    const battery = peripheral.adv_data[14];

    return {
      temperature,
      humidity,
      battery,
    };
  }
}
