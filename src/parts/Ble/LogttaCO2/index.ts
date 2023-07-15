/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */
/* eslint rulesdir/non-ascii: 0 */

import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizBleBeaconStruct,
  ObnizPartsBleCompare,
  uintBE,
} from '../../../obniz/ObnizPartsBleAbstract';
import Logtta from '../utils/abstracts/Logtta';

export interface Logtta_CO2Options {}

/**
 * data from Logtta_CO2
 *
 * Logtta_CO2から受け取ったデータ
 */
export interface Logtta_CO2_Data extends Logtta_CO2_Connected_Data {
  /**
   * remaining battery 電池残量
   *
   * Range 範囲: 0~100 (Unit 単位: 1 %)
   *
   * 254: USB power supply USB給電
   */
  battery: number;
  /**
   * measurement interval 測定周期
   *
   * Range 範囲: 1~2100 (Unit 単位: 1 s)
   */
  interval: number;
  /** BLE address BLEアドレス */
  address: string; // TODO: delete
}

/**
 * CO2 concentration data from Logtta_CO2
 *
 * Logtta_CO2からのCO2濃度データ
 */
export interface Logtta_CO2_Connected_Data {
  /**
   * CO2 concentration CO2濃度
   *
   * Range 範囲: 0~65535 (Unit 単位: 1 ppm)
   *
   * (supported value カタログ値: 0~2000)
   */
  co2: number;
}

/** Logtta_CO2 management class Logtta_CO2を管理するクラス */
export default class Logtta_CO2 extends Logtta<
  Logtta_CO2_Data,
  Logtta_CO2_Connected_Data
> {
  public static readonly PartsName = 'Logtta_CO2';

  public static readonly ServiceUuids = {
    Connectable: '31f3ab20-bd1c-46b1-91e4-f57abcf7d449',
    Beacon: null,
  };

  public static readonly BeaconDataStruct: ObnizPartsBleCompare<
    ObnizBleBeaconStruct<Logtta_CO2_Data>
  > = {
    Connectable: null,
    Beacon: {
      appearance: {
        index: 0,
        type: 'check',
        data: 0x02,
      },
      co2: {
        index: 1,
        length: 2,
        type: 'unsignedNumBE',
      },
      battery: {
        index: 5,
        type: 'unsignedNumBE',
      },
      interval: {
        index: 6,
        length: 2,
        type: 'unsignedNumBE',
      },
      /* alert: {
        index: 8,
        type: 'uint8',
      },
      name: {
        index: 9,
        length: 15,
        type: 'string',
      } */
      // TODO: delete
      address: {
        index: 0,
        type: 'custom',
        func: (data, peripheral) => peripheral.address,
      },
    },
  };

  /**
   * @deprecated
   *
   * Verify that the received peripheral is from the Logtta_CO2
   *
   * 受け取ったPeripheralがLogtta_CO2のものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the Logtta_CO2
   *
   * Logtta_CO2かどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return this.getDeviceMode(peripheral) === 'Connectable';
  }

  /**
   * @deprecated
   *
   * Verify that the received advertisement is from the Logtta_CO2 (in Beacon Mode)
   *
   * 受け取ったAdvertisementがLogtta_CO2のものかどうか確認する(ビーコンモード中)
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the Logtta_CO2
   *
   * Logtta_CO2かどうか
   */
  public static isAdvDevice(peripheral: BleRemotePeripheral): boolean {
    return this.getDeviceMode(peripheral) === 'Beacon';
  }

  protected readonly staticClass = Logtta_CO2;

  // TODO: delete
  // In order to maintain compatibility, when callback is placed from arguments, the behavior of the document street
  protected callbackFlag = false;

  /**
   * Notify when the CO2 concentration data have got from the Logtta_CO2 with connected state
   *
   * 接続している状態でLogtta_CO2からCO2濃度データを取得したとき通知
   *
   * @returns
   */
  public async startNotifyWait(
    callback: (data: Logtta_CO2_Connected_Data) => void
  ): Promise<void> {
    // TODO: delete try-catch
    try {
      this.checkConnected();
    } catch (e) {
      console.error(e);
      return;
    }

    // TODO: delete if
    if (callback) {
      this.callbackFlag = true;
      this.onNotify = callback;
    }
    return await this.subscribeWait(
      this.serviceUuid,
      this.getCharUuid(0x21),
      (data: number[]) => {
        if (this.onNotify) {
          if (this.callbackFlag) this.onNotify(this.parseData(data));
          else
            this.onNotify(
              (this.parseData(data).co2 as unknown) as Logtta_CO2_Connected_Data
            );
        }
      }
    );
  }

  /**
   * @deprecated
   *
   * Get CO2 concentration data with connected state
   *
   * 接続している状態でCO2濃度データを取得
   *
   * @returns CO2 concentration data from the Logtta_CO2
   *
   * Logtta_CO2から受け取ったCO2濃度データ
   */
  public async getWait(): Promise<number | null> {
    try {
      return (await this.getDataWait()).co2;
    } catch {
      return null;
    }
  }

  /**
   * @deprecated
   *
   * Set enable / disable for beacon mode (periodic beacon transmission)
   *
   * Call this function after authenticating with the sensor
   *
   * After setting, disconnect once to enable it
   *
   * To stop beacon mode, you need to hold the button on the sensor for more than 2 seconds
   *
   * (For more detail, please see http://www.uni-elec.co.jp/logtta_page.html )
   *
   * ビーコンモード(定期的なビーコン発信)の有効/無効の設定
   *
   * センサとの認証を済ませた状態で実行してください
   *
   * 設定後に切断した後から有効になります
   *
   * ビーコンモードの終了は、デバイスのボタンを2秒以上長押しする操作が必要です(詳しくは http://www.uni-elec.co.jp/logtta_page.html )
   *
   * @param enable enable the beacon mode or not ビーコンモードを有効にするかどうか
   *
   * @returns
   */
  public setBeaconMode(enable: boolean): Promise<boolean> {
    return this.setBeaconModeWait(enable);
  }

  protected parseData(data: number[]): Logtta_CO2_Connected_Data {
    return {
      co2: uintBE(data),
    };
  }
}
