/**
 * @packageDocumentation
 * @module Parts.iBS03G
 */
/* eslint rulesdir/non-ascii: 0 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface IBS03GOptions {}

/**
 * advertisement data from IBS03G
 *
 * IBS03Gからのadvertisementデータ
 */
export interface IBS03G_Data {
  /** battery 電池電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /**
   * button state ボタンの状態
   *
   * true: pressed 押された状態 / false: not pressed 押されていない状態
   */
  button: boolean;
  /** moving or not 動いているかどうか */
  moving: boolean;
  /** fallen or not 落ちたかどうか */
  fall: boolean;
}

/** iBS03G management class iBS03Gを管理するクラス */
export default class IBS03G implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'iBS03G',
    };
  }

  /**
   * Verify that the received peripheral is from the iBS03G
   *
   * 受け取ったPeripheralがiBS03Gのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the iBS03G
   *
   * iBS03Gかどうか
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
   * Get a data from the iBS03G
   *
   * iBS03Gからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the iBS03G iBS03Gから受け取ったデータ
   */
  public static getData(peripheral: BleRemotePeripheral): IBS03G_Data | null {
    if (!IBS03G.isDevice(peripheral)) {
      return null;
    }
    const data: IBS03G_Data = {
      battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
      button: false,
      moving: false,
      fall: false,
    };

    if (peripheral.adv_data[11] & 0b0001) {
      data.button = true;
    }
    if (peripheral.adv_data[11] & 0b0010) {
      data.moving = true;
    }
    if (peripheral.adv_data[11] & 0b1000) {
      data.fall = true;
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
    0x16, // subType
    -1, // reserved
    -1, // reserved
    -1, // reserved
  ];

  public _peripheral: BleRemotePeripheral | null = null;
}
