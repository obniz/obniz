/**
 * @packageDocumentation
 * @module Parts.iBS01
 */
/* eslint rulesdir/non-ascii: 0 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface IBS01Options {}

/**
 * advertisement data from IBS01
 *
 * IBS01からのadvertisementデータ
 */
export interface IBS01_Data {
  /** battery 電池電圧 */
  battery: number;
  /**
   * button state ボタンの状態
   *
   * true: pressed 押された状態 / false: not pressed 押されていない状態
   */
  button: boolean;

  /**
   * @deprecated use iBS01H library
   */
  moving: boolean;

  /**
   * @deprecated use iBS01H or iBS01G library
   */
  hall_sensor: boolean;

  /**
   * @deprecated use iBS01G library
   */
  fall: boolean;
}

/** iBS01 management class iBS01を管理するクラス */
export default class IBS01 implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'iBS01',
    };
  }

  /**
   * verify that the received peripheral is from the iBS01
   *
   * 受け取ったPeripheralがiBS01のものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @param strictCheck Whether do strict check
   *
   * strictCheckをするかどうか
   *
   * @returns Whether it is the iBS01
   *
   * iBS01かどうか
   */
  public static isDevice(
    peripheral: BleRemotePeripheral,
    strictCheck = false
  ): boolean {
    const deviceAdv = [...this.deviceAdv];
    if (strictCheck) {
      deviceAdv[18] = 0x03;
    }
    if (deviceAdv.length > peripheral.adv_data.length) {
      return false;
    }
    for (let index = 0; index < deviceAdv.length; index++) {
      if (deviceAdv[index] === -1) {
        continue;
      }
      if (peripheral.adv_data[index] === deviceAdv[index]) {
        continue;
      }
      return false;
    }
    return (
      peripheral.adv_data[12] === 0xff &&
      peripheral.adv_data[13] === 0xff &&
      peripheral.adv_data[14] === 0xff &&
      peripheral.adv_data[15] === 0xff
    );
  }

  /**
   * Get a data from the iBS01
   *
   * iBS01からデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @param strictCheck Whether do strict check
   *
   * strictCheckをするかどうか
   *
   * @returns received data from the iBS01 iBS01から受け取ったデータ
   */
  public static getData(
    peripheral: BleRemotePeripheral,
    strictCheck?: boolean
  ): IBS01_Data | null {
    if (!IBS01.isDevice(peripheral, strictCheck)) {
      return null;
    }
    const data: IBS01_Data = {
      battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
      button: false,
      moving: false,
      hall_sensor: false,
      fall: false,
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
    0x59, // Manufacturer vendor code
    0x00, // Manufacturer vendor code
    0x80, // Magic code
    0xbc, // Magic code
    -1, // Battery
    -1, // Battery
    -1, // Event
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // reserved
    -1, // subtype will be 0x03, but ignore for compatibility. Use 0x03 if set strictCheck.
    -1, // reserved
    -1, // reserved
    -1, // reserved
  ];

  public _peripheral: BleRemotePeripheral | null = null;
}
