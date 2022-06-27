/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
/* eslint rulesdir/non-ascii: 0 */

import { ObnizPartsBleMode } from '../../../obniz/ObnizPartsBleAbstract';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { MESH } from '../utils/abstracts/MESH';

export interface MESH_100THOptions {}

/**
 * advertisement data from MESH_100TH
 *
 * MESH_100THからのadvertisementデータ
 */
export interface MESH_100TH_Data {
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /** temperature 温度 (Unit 単位: 0.01 degC)*/
  temperature: number;
  /** humidity 相対湿度 (Unit 単位: 1% RH) */
  humidity: number;
}

/** MESH_100TH management class MESH_100THを管理するクラス */
export default class MESH_100TH extends MESH<MESH_100TH_Data> {
  public static readonly PartsName = 'MESH_100TH';
  public static AvailableBleMode = 'Connectable' as const;
  protected readonly staticClass = MESH_100TH;

  /**
   * adからこのデバイスであること判定する
   */
  public static isDeviceWithMode(
    peripheral: BleRemotePeripheral,
    mode: ObnizPartsBleMode
  ) {
    if (mode !== 'Connectable') {
      return false;
    }
    const ad = peripheral.adv_data;

    // sample
    // if(ad[0] === 0 && ad[1] === 1){
    //   return true
    // }
    return true;
  }

  /** 例） Event handler for button ボタンのイベントハンドラー */
  public onButtonPressed: ((pressed: boolean) => void) | null = null;

  /**
   * Connect to the services of a device
   *
   * デバイスのサービスに接続
   */
  public async connectWait(): Promise<void> {
    await super.connectWait();

    await this.authWait();
  }

  // 接続してデータを取ってくる
  public async getDataWait() {
    this.checkConnected();

    return {
      battery: 0,
      temperature: 0,
      humidity: 0,
    };
  }

  protected async beforeOnDisconnectWait(reason: unknown): Promise<void> {
    // do nothing
  }
}
