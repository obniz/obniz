/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */
/* eslint rulesdir/non-ascii: 0 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface IBS02IROptions {}

/**
 * advertisement data from IBS02IR
 *
 * IBS02IRからのadvertisementデータ
 */
export interface IBS02IR_Data {
  /** IR proximity sensor responded or not 赤外線近接センサが反応したかどうか */
  event: boolean;
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
}

/** iBS02IR management class iBS02IRを管理するクラス */
export default class IBS02IR implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'iBS02IR',
    };
  }

  /**
   * Verify that the received peripheral is from the iBS02IR
   *
   * 受け取ったPeripheralがiBS02IRのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the iBS02IR
   *
   * iBS02IRかどうか
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
   * Get a data from the iBS02IR
   *
   * iBS02IRからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the iBS02IR iBS02IRから受け取ったデータ
   */
  public static getData(peripheral: BleRemotePeripheral): IBS02IR_Data | null {
    if (!IBS02IR.isDevice(peripheral)) {
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
    0x02, // sub type
    -1, // reserved
    -1, // reserved
    -1, // reserved
  ];

  public _peripheral: BleRemotePeripheral | null = null;
}
