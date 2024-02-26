/**
 * @packageDocumentation
 * @module Parts.iBeacon
 */
/* eslint rulesdir/non-ascii: 0 */

// import {BleRemotePeripheral, ObnizPartsBleInterface, ObnizPartsBleInfo} from 'obniz';

import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface iBeaconOptions {}

/**
 * advertisement data from iBeacon
 *
 * iBeaconからのadvertisementデータ
 */
export interface iBeacon_Data {
  uuid: string;
  major: number;
  minor: number;
  power: number;
}

/** iBeacon management class iBeacon管理クラス */
export default class iBeacon implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'iBeacon',
    };
  }

  /**
   * Verify that the received peripheral is iBeacon
   *
   * 受け取ったPeripheralがiBeaconのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the iBeacon
   *
   * iBeaconかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return peripheral.iBeacon != null;
  }

  /**
   * Get a data from the iBeacon
   *
   * iBeaconからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the iBeacon
   */
  public static getData(peripheral: BleRemotePeripheral): iBeacon_Data | null {
    if (!peripheral.iBeacon) {
      return null;
    }
    const iBeaconData = peripheral.iBeacon;

    return {
      uuid: iBeaconData.uuid,
      major: iBeaconData.major,
      minor: iBeaconData.minor,
      power: iBeaconData.power,
    };
  }

  public _peripheral: BleRemotePeripheral | null = null;
}
