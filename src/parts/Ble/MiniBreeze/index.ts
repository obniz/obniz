/**
 * @packageDocumentation
 * @module Parts.MiniBreeze
 */
/* eslint rulesdir/non-ascii: 0 */

import Obniz from '../../../obniz';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizUtil from '../../../obniz/libs/utils/util';
import ObnizPartsBleInterface from '../../../obniz/ObnizPartsBleInterface';

/**
 * advertisement data from MiniBreeze
 *
 * MiniBreezeからのadvertisementデータ
 */
export interface MiniBreeze_InfoData {
  /** gas type ガスタイプ */
  gasType:
    | 'none'
    | 'HCHO'
    | 'CO'
    | 'CO2'
    | 'Rn'
    | 'PM1.0'
    | 'PM2.5'
    | 'PM10'
    | 'unknown';
  /**
   * gas sensor value ガスセンサの値
   * (Unit 単位: ppm or ug/m3)
   */
  sensVal: number;
  /**
   * temperature 温度
   *
   * Range 範囲: -99~99 (Unit 単位: 1 degC)
   */
  temperature: number;
  /**
   * relative humidity 湿度
   *
   * Range 範囲: 0~100 (Unit 単位: 1%RH)
   */
  humidity: number;
  /** Firmware version ファームウェアのバージョン */
  version: string;
  /**
   * battery status バッテリーの状態
   */
  status:
    | 'BatteryEmpty'
    | 'BatteryLow'
    | 'BatteryNormal'
    | 'BatteryCharging'
    | 'Invalid';
  /** device name デバイスの名前 */
  devName: string;
}

export interface MiniBreezeOptions {}

/** MiniBreeze management class MiniBreezeを管理するクラス */
export default class MiniBreeze extends ObnizPartsBleInterface {
  public static info() {
    return { name: 'MiniBreeze' };
  }

  /**
   * @returns object of gas types list ガスタイプの一覧のオブジェクト
   */
  public static gasType(): any {
    return {
      0: 'none',
      1: 'HCHO',
      2: 'CO',
      3: 'CO2',
      5: 'Rn',
      6: 'PM1.0',
      7: 'PM2.5',
      8: 'PM10',
    };
  }

  /**
   * @returns object of battery status list バッテリーの状態の一覧のオブジェクト
   */
  public static status(): any {
    return {
      0: 'BatteryEmpty',
      1: 'BatteryLow',
      2: 'BatteryNormal',
      3: 'BatteryCharging',
    };
  }

  /**
   * Verify that the received peripheral is from the MiniBreeze
   *
   * 受け取ったPeripheralがMiniBreezeのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the MiniBreeze
   *
   * MiniBreezeかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    if (peripheral.adv_data.length !== 31 || !this._hasPrefix(peripheral)) {
      return false;
    }
    return true;
  }

  /**
   * Get a data from the MiniBreeze
   *
   * MiniBreezeからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the MiniBreeze
   *
   * MiniBreezeから受け取ったデータ
   */
  public static getData(
    peripheral: BleRemotePeripheral
  ): null | MiniBreeze_InfoData {
    if (!this._hasPrefix(peripheral)) {
      return null;
    }
    if (
      !peripheral.adv_data ||
      peripheral.adv_data.length !== 31 ||
      !peripheral.localName
    ) {
      return null;
    }
    const buf = Buffer.from(peripheral.adv_data.splice(7));
    const gasType = MiniBreeze.gasType()[buf.readUInt8(0)] || 'unknown';
    const sensVal = buf.readUInt16LE(1);
    const temperature = buf.readUInt8(3);
    const humidity = buf.readUInt8(4);
    const version =
      buf.readUInt8(5) + '.' + buf.readUInt8(6) + '.' + buf.readUInt8(7);
    const status = MiniBreeze.status()[buf.readUInt8(9)] || 'Invalid';

    return {
      gasType,
      sensVal,
      temperature,
      humidity,
      version,
      status,
      devName: peripheral.localName,
    };
  }

  private static _hasPrefix(peripheral: BleRemotePeripheral): boolean {
    if (!peripheral.adv_data || peripheral.adv_data.length < 10) {
      return false;
    }
    const target = [
      // flag
      0x02,
      0x01,
      0x06,
      // ManufactureData
      0x0d,
      0xff,
      0xff,
      0x02,
    ];
    for (const index in target) {
      if (target[index] >= 0 && target[index] !== peripheral.adv_data[index]) {
        return false;
      }
    }
    return true;
  }

  public _peripheral: null | BleRemotePeripheral = null;

  // non-wired device
  public keys: string[] = [];
  public requiredKeys: string[] = [];
  public params: any = {};

  public wired(obniz: Obniz): void {
    // do nothing.
  }
}
