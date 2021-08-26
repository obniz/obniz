/**
 * @packageDocumentation
 * @module Parts.iBS03
 */
/* eslint rulesdir/non-ascii: 0 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface IBS03Options {}

/**
 * advertisement data from IBS03
 *
 * IBS03からのadvertisementデータ
 */
export interface IBS03_Data {
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /**
   * button state ボタンの状態
   *
   * true: pressed 押された状態 / false: not pressed 押されていない状態
   */
  button: boolean;
  /** moving or not 動いているかどうか */
  moving: boolean;
  /** magnet nearby or not 近くに磁石があるかどうか */
  hall_sensor: boolean;
}

/** iBS03 management class iBS03を管理するクラス */
export default class IBS03 implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'iBS03',
    };
  }

  /**
   * Verify that the received peripheral is from the iBS03
   *
   * 受け取ったPeripheralがiBS03のものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the iBS03
   *
   * iBS03かどうか
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
   * Get a data from the iBS03
   *
   * iBS03からデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the iBS03 iBS03から受け取ったデータ
   */
  public static getData(peripheral: BleRemotePeripheral): IBS03_Data | null {
    if (!IBS03.isDevice(peripheral)) {
      return null;
    }
    const data: IBS03_Data = {
      battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
      button: false,
      moving: false,
      hall_sensor: false,
    };

    if (peripheral.adv_data[11] & 0b0001) {
      data.button = true;
    }
    if (peripheral.adv_data[11] & 0b0010) {
      data.moving = true;
    }
    if (peripheral.adv_data[11] & 0b0100) {
      data.hall_sensor = true;
    }
    return data;
  }

  private static deviceAdv: number[] = [
    0x02,
    0x01,
    0x06,
    0x12,
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
    -1, // reserved
    -1, // reserved
    -1, // user
    -1, // user
    0x10, // subType
    -1, // reserved
    -1, // reserved
    -1, // reserved
  ];

  public _peripheral: BleRemotePeripheral | null = null;
}
