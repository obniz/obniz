/**
 * @packageDocumentation
 * @module Parts.PLS_01BT
 */
/* eslint rulesdir/non-ascii: 0 */

import Obniz from '../../../obniz';
import { BleRemoteCharacteristic } from '../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsInterface,
  ObnizPartsInfo,
} from '../../../obniz/ObnizPartsInterface';

/**
 * data from PLS_01BT
 *
 * PLS_01BTからのデータ
 */
export interface PLS_01BTResult {
  /**
   * pulse rate 脈拍数
   *
   * Range 範囲: 25~250 (Unit 単位: 1 bpm)
   */
  pulseRate: number;
  /**
   * blood oxygen level 血中酸素濃度
   *
   * Range 範囲: 35~100 (Unit 単位 1 %)
   */
  bloodOxygenLevel: number;
  /**
   * perfusion index 灌流指数
   *
   * Range 範囲: 0~200
   */
  perfusionIndex: number;
}

export interface PLS_01BTOptions {}

/** PLS_01BT management class PLS_01BTを管理するクラス */
export default class PLS_01BT implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: 'PLS_01BT',
    };
  }

  /**
   * Verify that the received peripheral is from the PLS_01BT
   *
   * 受け取ったPeripheralがPLS_01BTのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the PLS_01BT
   *
   * PLS_01BTかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral) {
    if (
      peripheral.localName &&
      peripheral.localName.startsWith('My Oximeter')
    ) {
      return true;
    }
    return false;
  }

  public keys: string[] = [];
  public requiredKeys: string[] = [];
  public params: any;
  /**
   * Callback when receiving the measured data
   *
   * 計測結果を受け取ったときにコールバック
   */
  public onmeasured: ((result: PLS_01BTResult) => void) | null = null;
  public ondisconnect?: (reason: any) => void;

  private _uuids = {
    service: 'CDEACB80-5235-4C07-8846-93A37EE6B86D',
    rxChar: 'CDEACB81-5235-4C07-8846-93A37EE6B86D',
  };
  private _peripheral: BleRemotePeripheral | null = null;
  private _rxCharacteristic: BleRemoteCharacteristic | null = null;
  private _txCharacteristic: BleRemoteCharacteristic | null = null;

  constructor(peripheral: BleRemotePeripheral | null) {
    if (peripheral && !PLS_01BT.isDevice(peripheral)) {
      throw new Error('peripheral is not PLS_01BT');
    }
    this._peripheral = peripheral;
  }

  public wired(obniz: Obniz): void {
    // do nothing.
  }

  /**
   * Connect the sensor
   *
   * センサへ接続
   */
  public async connectWait() {
    if (!this._peripheral) {
      throw new Error('PLS_01BT is not find.');
    }
    this._peripheral.ondisconnect = (reason) => {
      if (this.ondisconnect) {
        this.ondisconnect(reason);
      }
    };
    await this._peripheral.connectWait();
    this._rxCharacteristic = this._peripheral
      .getService(this._uuids.service)!
      .getCharacteristic(this._uuids.rxChar);

    if (!this._rxCharacteristic) {
      throw new Error('device is not PLS_01BT');
    }

    await this._rxCharacteristic.registerNotifyWait((data) => {
      if (data.length === 4 && data[0] === 0x81) {
        if (data[1] !== 255 && data[2] !== 177) {
          const pulseRate = data[1];
          const bloodOxygenLevel = data[2];
          const perfusionIndex = data[3];
          if (this.onmeasured) {
            this.onmeasured({
              pulseRate,
              bloodOxygenLevel,
              perfusionIndex,
            });
          }
        }
      }
    });
  }

  /**
   * Disconnect from the sensor
   *
   * センサから切断
   */
  public async disconnectWait() {
    if (!this._peripheral) {
      throw new Error('PLS_01BT is not find.');
    }
    await this._peripheral.disconnectWait();
  }
}
