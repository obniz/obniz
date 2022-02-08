/**
 * @packageDocumentation
 * @module Parts.RS_Seek3
 */
/* eslint rulesdir/non-ascii: 0 */

import Obniz from '../../../obniz';
import BleRemoteCharacteristic from '../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface from '../../../obniz/ObnizPartsBleInterface';
import ObnizPartsInterface, {
  ObnizPartsInfo,
} from '../../../obniz/ObnizPartsInterface';

export interface RS_Seek3Options {}

/** RS_Seek3 management class RS_Seek3を管理するクラス */
export default class RS_Seek3 extends ObnizPartsBleInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: 'RS_Seek3',
    };
  }

  /**
   * Verify that the received peripheral is from the RS_Seek3
   *
   * 受け取ったPeripheralがRS_Seek3のものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the RS_Seek3
   *
   * RS_Seek3かどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral) {
    if (peripheral.localName !== 'Seek3') {
      return false;
    }
    return true;
  }

  public keys: string[] = [];
  public requiredKeys: string[] = [];
  public params: any;
  /**
   * Callback when the button is pressed
   *
   * ボタンが押されたときにコールバック
   */
  public onpressed: (() => void) | null = null;
  public _peripheral: BleRemotePeripheral | null = null;
  public ondisconnect?: (reason: any) => void;

  private _uuids = {
    service: '0EE71523-981A-46B8-BA64-019261C88478',
    buttonChar: '0EE71524-981A-46B8-BA64-019261C88478',
    tempHumidChar: '0EE7152C-981A-46B8-BA64-019261C88478',
  };
  private _buttonCharacteristic: BleRemoteCharacteristic | null = null;
  private _tempHumidCharacteristic: BleRemoteCharacteristic | null = null;

  constructor(peripheral: BleRemotePeripheral | null) {
    super();
    if (peripheral && !RS_Seek3.isDevice(peripheral)) {
      throw new Error('peripheral is not RS_Seek3');
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
      throw new Error('RS_Seek3 is not find.');
    }
    this._peripheral.ondisconnect = (reason: any) => {
      if (typeof this.ondisconnect === 'function') {
        this.ondisconnect(reason);
      }
    };
    await this._peripheral.connectWait();
    this._buttonCharacteristic = this._peripheral
      .getService(this._uuids.service)!
      .getCharacteristic(this._uuids.buttonChar);
    this._tempHumidCharacteristic = this._peripheral
      .getService(this._uuids.service)!
      .getCharacteristic(this._uuids.tempHumidChar);

    if (this._buttonCharacteristic) {
      this._buttonCharacteristic.registerNotify((data: number[]) => {
        if (typeof this.onpressed === 'function') {
          this.onpressed();
        }
      });
    }
  }

  /**
   * Disconnect from the sensor
   *
   * センサから切断
   */
  public async disconnectWait() {
    await this._peripheral?.disconnectWait();
  }

  /**
   * Get temperature and humidity data from the RS_SEEK3
   *
   * RS_SEEK3から温湿度データを取得
   *
   * @returns temperature and humidity data 温湿度データ
   *
   * ```
   * {
   *
   * temperature: temperature 温度,
   *
   * humidity: humidity 湿度
   *
   * }
   * ```
   */
  public async getTempHumidWait(): Promise<{
    temperature: number;
    humidity: number;
  }> {
    if (!this._tempHumidCharacteristic) {
      throw new Error('device is not connected');
    }
    const data = await this._tempHumidCharacteristic.readWait();
    return { temperature: data[0], humidity: data[1] };
  }
}
