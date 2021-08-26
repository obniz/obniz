/**
 * @packageDocumentation
 * @module Parts.iBS01H
 */
/* eslint rulesdir/non-ascii: 0 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface IBS01HOptions {}

/**
 * advertisement data from IBS01H
 *
 * IBS01Hからのadvertisementデータ
 */
export interface IBS01H_Data {
  /** battery 電池電圧 (V) */
  battery: number;
  /**
   * button state ボタンの状態
   *
   * true: pressed 押された状態 / false: not pressed 押されていない状態
   */
  button: boolean;
  /** magnet nearby or not 近くに磁石があるかどうか */
  hall_sensor: boolean;
}

/** iBS01H management class iBS01Hを管理するクラス */
export default class IBS01H implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'iBS01H',
    };
  }

  /**
   * verify that the received peripheral is from the iBS01H
   *
   * 受け取ったPeripheralがiBS01Hのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the iBS01H
   *
   * iBS01Hかどうか
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
    return (
      peripheral.adv_data[12] === 0xff &&
      peripheral.adv_data[13] === 0xff &&
      peripheral.adv_data[14] === 0xff &&
      peripheral.adv_data[15] === 0xff
    );
  }

  /**
   * Get a data from the iBS01H
   *
   * iBS01Hからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the iBS01H iBS01Hから受け取ったデータ
   */
  public static getData(peripheral: BleRemotePeripheral): IBS01H_Data | null {
    if (!IBS01H.isDevice(peripheral)) {
      return null;
    }
    const data: IBS01H_Data = {
      battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
      button: false,
      hall_sensor: false,
    };

    if (peripheral.adv_data[11] & 0b0001) {
      data.button = true;
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
    0x04, // subtype
    -1, // reserved
    -1, // reserved
    -1, // reserved
  ];

  public _peripheral: BleRemotePeripheral | null = null;
}
