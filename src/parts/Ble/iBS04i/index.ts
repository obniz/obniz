/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */
/* eslint rulesdir/non-ascii: 0 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';

export interface IBS04IOptions {}

/**
 * advertisement data from IBS04i
 *
 * IBS04iからのadvertisementデータ
 */
export interface IBS04I_Data {
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /**
   * button state ボタンの状態
   *
   * true: pressed 押された状態 / false: not pressed 押されていない状態
   */
  button: boolean;
  /** iBeacon UUID */
  uuid: string;
  /** iBeacon major */
  major: number;
  /** iBeacon minor */
  minor: number;
  /** iBeacon power */
  power: number;
  /**
   * RSSI(Received Signal Strength Indicator) 電波強度 (Unit 単位: dBm) */
  rssi: number;
  /** BLE address BLEのアドレス */
  address: string;
}

/** iBS04i management class iBS04iを管理するクラス */
export default class IBS04I implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'iBS04i',
    };
  }

  /**
   * Verify that the received peripheral is from the iBS04i
   *
   * 受け取ったPeripheralがiBS04iのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the iBS04i
   *
   * iBS04iかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return IBS04I.getDeviceArray(peripheral) !== null;
  }

  /**
   * Get a data from the iBS04i
   *
   * iBS04iからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the iBS04i iBS04iから受け取ったデータ
   */
  public static getData(peripheral: BleRemotePeripheral): IBS04I_Data | null {
    const adv = IBS04I.getDeviceArray(peripheral);
    if (adv === null) {
      return null;
    }
    const data: IBS04I_Data = {
      battery: (adv[5] + adv[6] * 256) * 0.01,
      button: Boolean(adv[7]),
      uuid: peripheral.iBeacon!.uuid,
      major: peripheral.iBeacon!.major,
      minor: peripheral.iBeacon!.minor,
      power: peripheral.iBeacon!.power,
      rssi: peripheral.iBeacon!.rssi,
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
    0xff, // reserved
    0xff, // reserved
    0xff, // reserved
    0xff, // reserved
    0x00, // user
    -1, // user
    0x18, // subType
    -1, // reserved
    -1, // reserved
    -1, // reserved
  ];

  private static getDeviceArray(
    peripheral: BleRemotePeripheral
  ): number[] | null {
    const advertise = peripheral.advertise_data_rows.filter((adv: number[]) => {
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
    const type = advertise[0][14];
    if (type !== 24) {
      // is not ibs04i
      return null;
    }
    return advertise[0];
  }

  public _peripheral: BleRemotePeripheral | null = null;
}
