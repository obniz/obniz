/**
 * @packageDocumentation
 * @module Parts.iBS02PIR
 */
/* eslint rulesdir/non-ascii: 0 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface IBS02PIROptions {}

/**
 * advertisement data from IBS02PIR
 *
 * IBS02PIRからのadvertisementデータ
 */
export interface IBS02PIR_Data {
  /**
   * PIR (human detection) sensor responded or not
   *
   * PIR(人感)センサが反応したかどうか
   */
  event: boolean;
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
}

/** iBS02PIR management class iBS02PIRを管理するクラス */
export default class IBS02PIR implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'iBS02PIR',
    };
  }

  /**
   * Verify that the received peripheral is from the iBS02PIR
   *
   * 受け取ったPeripheralがiBS02PIRのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the iBS02PIR
   *
   * iBS02PIRかどうか
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
   * Get a data from the iBS02PIR
   *
   * iBS02PIRからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the iBS02PIR iBS02PIRから受け取ったデータ
   */
  public static getData(peripheral: BleRemotePeripheral): IBS02PIR_Data | null {
    if (!IBS02PIR.isDevice(peripheral)) {
      return null;
    }
    return {
      battery: (peripheral.adv_data[9] + peripheral.adv_data[10] * 256) * 0.01,
      event: Boolean(peripheral.adv_data[11] & 0b100),
    };
  }

  private static deviceAdv: number[] = [
    0x02,
    0x01,
    0x06,
    0x12,
    0xff,
    0x0d, // Manufacturer vendor code
    0x00, // Manufacturer vendor code
    0x82, // Magic code
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
    0x01, // sub type
    -1, // reserved
    -1, // reserved
    -1, // reserved
  ];

  public _peripheral: BleRemotePeripheral | null = null;
}
