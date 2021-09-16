/* eslint rulesdir/non-ascii: 0 */

import Obniz from '../../../obniz';
import BleRemoteCharacteristic from '../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsInterface, {
  ObnizPartsInfo,
} from '../../../obniz/ObnizPartsInterface';

export interface RS_BTIREX2Options {}

// not working
/** 【NOT WORKING】 RS_BTIREX2 management class RS_BTIREX2を管理するクラス */
export default class RS_BTIREX2 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: 'RS_BTIREX2',
    };
  }

  /**
   * Verify that the received peripheral is from the RS_BTIREX2
   *
   * 受け取ったPeripheralがRS_BTIREX2のものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the RS_BTIREX2
   *
   * RS_BTIREX2かどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral) {
    if (peripheral.localName && peripheral.localName.startsWith('BTIR')) {
      return true;
    }
    return false;
  }

  public keys: string[] = [];
  public requiredKeys: string[] = [];
  public params: any;
  /**
   * Callback when the button is pressed
   *
   * ボタンが押されたときにコールバック
   */
  public onbuttonpressed: ((pressed: boolean) => void) | null = null;

  private _uuids = {
    service: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    rxChar: '6e400002-b5a3-f393-e0a9-e50e24dcca9e',
    txChar: '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
  };
  private _peripheral: BleRemotePeripheral | null = null;
  private _rxCharacteristic: BleRemoteCharacteristic | null = null;
  private _txCharacteristic: BleRemoteCharacteristic | null = null;

  constructor(peripheral: BleRemotePeripheral | null) {
    if (peripheral && !RS_BTIREX2.isDevice(peripheral)) {
      throw new Error('peripheral is not RS_BTIREX2');
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
      throw new Error('RS_BTIREX2 is not find.');
    }
    this._peripheral.ondisconnect = () => {
      console.log('disconnect');
    };
    await this._peripheral.connectWait();

    console.error('encrypt start');
    // const handle = this._peripheral.obnizBle.centralBindings._handles[this._peripheral.address];
    // this._peripheral.obnizBle.centralBindings._aclStreams[handle].encrypt();
    this._rxCharacteristic = this._peripheral
      .getService(this._uuids.service)!
      .getCharacteristic(this._uuids.rxChar);
    this._txCharacteristic = this._peripheral
      .getService(this._uuids.service)!
      .getCharacteristic(this._uuids.txChar);
  }

  /**
   * Make and send a command
   *
   * コマンドの作成と送信
   *
   * @param payload payload ペイロード
   *
   * @param crc CRC of the payload ペイロードのCRC
   *
   * @returns
   */
  public _sendAndReceiveWait(payload: number[], crc = 0xb6): Promise<number[]> {
    if (!this._rxCharacteristic || !this._txCharacteristic) {
      throw new Error('device is not connected');
    }
    const data: number[] = new Array(payload.length + 4);
    data[0] = 0xaa;
    data[1] = 0;
    data[2] = payload.length;
    for (let index = 0; index < payload.length; index++) {
      data[3 + index] = payload[index];
    }
    data[payload.length + 3] = crc;
    const tx = this._txCharacteristic;
    const p: Promise<number[]> = new Promise((resolve) => {
      tx.registerNotify((resultData: number[]) => {
        console.error('CRC ' + crc);
        resolve(resultData);
      });
    });
    this._rxCharacteristic.write(data);
    return p;
  }
}
