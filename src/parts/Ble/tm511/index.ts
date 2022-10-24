/**
 * @packageDocumentation
 * @module Parts.TM511
 */
/* eslint rulesdir/non-ascii: 0 */

import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface TM511Options {}

/**
 * advertisement data from TM511
 *
 * TM511からのadvertisementデータ
 */
export interface TM511_Data {
  /**
   * battery バッテリー
   */
  battery: number;
  /**
   * X-axis acceleration X軸加速度
   */
  x: number;
  /**
   * Y-axis acceleration Y軸加速度
   */
  y: number;
  /**
   * Z-axis acceleration Z軸加速度
   */
  z: number;
}

/** TM511 management class TM511を管理するクラス */
export default class TM511 implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'TM511',
    };
  }

  /**
   * Verify that the received peripheral is from the TM511
   *
   * 受け取ったPeripheralがTM511のものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the TM511
   *
   * TM511かどうか
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
   * Get a data from the TM511
   *
   * TM511からのデータ取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the TM511 TM511から受け取ったデータ
   */
  public static getData(peripheral: BleRemotePeripheral): TM511_Data | null {
    if (!TM511.isDevice(peripheral)) {
      return null;
    }
    const data: TM511_Data = {
      battery: peripheral.adv_data[13],
      x:
        peripheral.adv_data[14] +
        ObnizPartsBleInterface.readFraction(peripheral.adv_data[15]),
      y:
        peripheral.adv_data[16] +
        ObnizPartsBleInterface.readFraction(peripheral.adv_data[17]),
      z:
        peripheral.adv_data[18] +
        ObnizPartsBleInterface.readFraction(peripheral.adv_data[19]),
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
    0xa1,
    0x03,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
  ];

  public _peripheral: BleRemotePeripheral | null = null;
}
