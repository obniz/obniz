/**
 * @packageDocumentation
 * @module Parts.Agx_SkinTemp
 */
/* eslint rulesdir/non-ascii: 0 */

import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface Agx_SkinTempOptions {}

export interface Agx_SkinTempData {
  temperature: number;
  battery: number;
}

/** Agx_SkinTemp management class Agx_SkinTempを管理するクラス */
export default class Agx_SkinTemp implements ObnizPartsBleInterface {
  public _peripheral: BleRemotePeripheral | null = null;

  public static info(): ObnizPartsBleInfo {
    return {
      name: 'Agx_SkinTemp',
    };
  }

  /**
   * Verify that the received peripheral is from the Agx_SkinTemp
   *
   * 受け取ったPeripheralがAgx_SkinTempのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the Agx_SkinTemp
   *
   * Agx_SkinTempかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return peripheral.localName?.startsWith('IW_') ?? false;
  }

  /**
   * Get a data from the Agx_SkinTemp
   *
   * Agx_SkinTempからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the Agx_SkinTemp Agx_SkinTempから受け取ったデータ
   */
  public static getData(
    peripheral: BleRemotePeripheral
  ): Agx_SkinTempData | null {
    if (!Agx_SkinTemp.isDevice(peripheral)) {
      return null;
    }

    const temperature =
      Math.floor(
        Buffer.from([
          peripheral.adv_data[10],
          peripheral.adv_data[11],
        ]).readInt16LE(0) *
          0.005 *
          100
      ) / 100;
    const battery = peripheral.adv_data[26];

    return {
      temperature,
      battery,
    };
  }
}
