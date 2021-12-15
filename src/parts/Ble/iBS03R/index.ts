/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */
/* eslint rulesdir/non-ascii: 0 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface IBS03ROptions {}

/**
 * advertisement data from iBS03R
 *
 * iBS03Rからのadvertisementデータ
 */
export interface IBS03R_Data {
  /** battery 電池電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /**
   * button state ボタンの状態
   *
   * true: pressed 押された状態 / false: not pressed 押されていない状態
   */
  button: boolean;
  /** distance 距離 (Unit 単位: 1 mm) */
  distance: number;
  /** MAC address MACアドレス */
  address: string;
}

/** iBS03R management class iBS03Rを管理するクラス */
export default class IBS03R implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'iBS03R',
    };
  }

  /**
   * Verify that the received peripheral is from the iBS03R
   *
   * 受け取ったPeripheralがiBS03Rのものかどうか確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the iBS03R
   *
   * iBS03Rかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return IBS03R.getDeviceArray(peripheral) !== null;
  }

  /**
   * Get a data from the iBS03R
   *
   * iBS03Rからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the iBS03R iBS03Rから受け取ったデータ
   */
  public static getData(peripheral: BleRemotePeripheral): IBS03R_Data | null {
    const adv = IBS03R.getDeviceArray(peripheral);
    if (adv === null) {
      return null;
    }

    const data: IBS03R_Data = {
      battery: (adv[5] + adv[6] * 256) * 0.01,
      button: Boolean(adv[7]),
      distance: adv[10] + adv[11] * 256,
      address: peripheral.address,
    };
    return data;
  }

  private static deviceAdv: number[] = [
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
    -1, // distance
    -1, // distance
    -1, // user
    -1, // user
    0x13, // subType
    -1, // reserved
    -1, // reserved
    -1, // reserved
  ];

  private static getDeviceArray(
    peripheral: BleRemotePeripheral
  ): number[] | null {
    const advertise = !peripheral.advertise_data_rows
      ? []
      : peripheral.advertise_data_rows.filter((adv: number[]) => {
          let find = false;
          if (this.deviceAdv.length > adv.length) {
            return find;
          }
          for (let index = 0; index < this.deviceAdv.length; index++) {
            if (this.deviceAdv[index] === -1) {
              continue;
            }
            if (adv[index] === this.deviceAdv[index]) {
              find = true;
              continue;
            }
            find = false;
            break;
          }
          return find;
        });
    if (advertise.length !== 1) {
      return null;
    }
    return advertise[0];
  }

  public _peripheral: BleRemotePeripheral | null = null;
}
