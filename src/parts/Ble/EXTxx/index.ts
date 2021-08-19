/**
 * @packageDocumentation
 * @module Parts.EXTxx
 */
/* eslint rulesdir/non-ascii: 0 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface from '../../../obniz/ObnizPartsBleInterface';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';

export interface EXTxx_Options {}

export type EXTxx_Type = 'wBeacon' | 'BatteryLevelNotification';

/**
 * advertisement data from EXTxx
 *
 * EXTxxからのadvertisementデータ
 */
export interface EXTxx_Data {
  /** iBeacon uuid */
  uuid: string;
  /** iBeacon major */
  major: number;
  /** iBeacon minor */
  minor: number;
  /** iBeacon power */
  power: number;
  /** remaining battery 電池残量 */
  battery: number;
  // type: EXTxx_Type;
}

/** EXTxx management class EXTxxを管理するクラス */
export default class EXTxx extends ObnizPartsBleInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: 'EXTxx',
    };
  }

  public static readonly PartsName = 'EXTxx';

  public static readonly AvailableBleMode = 'Beacon';

  protected static DefaultAdvData = [
    0x1c,
    0xff,
    0xf5, // Manufacturer vendor code
    0x03, // Manufacturer vendor code
    0x02, // Beacon ID
    0x15, // Beacon ID
    -1, // UUID
    -1, // UUID
    -1, // UUID
    -1, // UUID
    -1, // UUID
    -1, // UUID
    -1, // UUID
    -1, // UUID
    -1, // UUID
    -1, // UUID
    -1, // UUID
    -1, // UUID
    -1, // UUID
    -1, // UUID
    -1, // UUID
    -1, // UUID
    -1, // Major number
    -1, // Major number
    -1, // Minor number
    -1, // Minor number
    -1, // Measured power
    -1, // Battery
    0x00, // Type  0: wBeacon  1: BatteryLevelNotification
  ];

  /**
   * (with instantiation) Get a data from the beacon
   *
   * (インスタンス化する場合) ビーコンからデータを取得
   *
   * @returns received data from the beacon ビーコンから受け取ったデータ
   */
  public getData(): EXTxx_Data {
    const advData = this._peripheral?.adv_data;
    if (!advData) throw new Error('advData is null');
    return {
      uuid: advData
        .slice(6, 22)
        .map(
          (d, i) =>
            ([2, 3, 4, 5].includes(i / 2) ? '-' : '') +
            ('00' + d.toString(16)).slice(-2)
        )
        .join(''),
      major: unsigned16(advData.slice(22, 24)),
      minor: unsigned16(advData.slice(24, 26)),
      power: advData[26],
      battery: advData[27],
    };
  }

  /**
   * (without instantiation) Get a data from the beacon
   *
   * (インスタンス化しない場合) ビーコンからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the beacon ビーコンから受け取ったデータ
   */
  public static getData(peripheral: BleRemotePeripheral): EXTxx_Data | null {
    if (!EXTxx.isDevice(peripheral)) {
      return null;
    }
    const dev = new EXTxx(peripheral);
    return dev.getData();
  }

  constructor(peripheral: BleRemotePeripheral) {
    super();
    this._peripheral = peripheral;
  }

  /**
   * verify that the received peripheral is from the EXTxx
   *
   * 受け取ったperipheralがEXTxxのものかどうか確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the EXTxx
   *
   * EXTxxかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return (
      this.DefaultAdvData.filter(
        (d, i) => d !== -1 && d !== peripheral.adv_data[i]
      ).length === 0 &&
      this.DefaultAdvData.length === peripheral.adv_data.length
    );
  }
}

const unsigned16 = (value: number[]): number => {
  return (value[0] << 8) | value[1];
};
