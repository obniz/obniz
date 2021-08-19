/**
 * @packageDocumentation
 * @module Parts.HEM_6233T
 */
/* eslint rulesdir/non-ascii: 0 */

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface from '../../../obniz/ObnizPartsBleInterface';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';

export interface HEM_6233TOptions {}

export type HEM_6233TMeasurementStatus =
  | 'BodyMovementDetection'
  | 'CuffFitDetection'
  | 'IrregularPulseDetection'
  | 'PulseRateRangeDetection'
  | 'MeasurementPositionDetection';

/**
 * data from HEM_6233T
 *
 * HEM_6233Tからのデータ
 */
export interface HEM_6233TResult {
  /**
   * Blood pressure 血圧
   *
   * - Systolic pressure 最低血圧 (Range 範囲: 25-280)
   * - Diastolic pressure 最高血圧 (Range 範囲: 25-280)
   * - Mean arterial pressure 平均血圧 (Range 範囲: 25-280)
   */
  bloodPressure?: {
    systolic: number;
    diastolic: number;
    meanArterialPressure: number;
    unit: 'mmHg';
  };
  /** Time 時刻 */
  date?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
  /** Pulse rate value 脈拍値*/
  pulseRate?: number;
  /** User ID ユーザID */
  userId?: number;
  /**
   * Measurement status 測定状態
   *
   * [0] Body Movement Detection Flag 体動検知
   *
   * 0: Stable 静止 / 1: Moved 運動
   *
   *
   * [1] Cuff Fit Detection Flag 袖口へのフィット具合
   *
   * 0: Fit properly 適正 / 1: Too loose 緩い
   *
   *
   * [2] Irregular Pulse Detection Flag 不整脈検出
   *
   * 0: Normal 通常 / 1: Irregular 異常
   *
   *
   * [5] Measurement Position Detection Flag 測定位置検出
   *
   * 0: Proper 適正 / 1: Improper 適正でない
   */
  measurementStatus?: HEM_6233TMeasurementStatus[];
}

/** HEM_6233T management class HEM_6233Tを管理するクラス */
export default class HEM_6233T implements ObnizPartsBleInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: 'HEM_6233T',
    };
  }

  /**
   * verify that the received peripheral is from the HEM_6233T
   *
   * 受け取ったPeripheralがHEM_6233Tのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the HEM_6233T
   *
   * HEM_6233Tかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral) {
    if (
      peripheral.localName &&
      (peripheral.localName.startsWith('BLESmart_') ||
        peripheral.localName.startsWith('BLEsmart_'))
    ) {
      return true;
    }
    return false;
  }

  public keys: string[] = [];
  public requiredKeys: string[] = [];
  public params: any;
  public _peripheral: BleRemotePeripheral | null = null;
  private _timezoneOffsetMinute: number;

  /**
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @param timezoneOffsetMinute difference from UTC (Unit: minutes) 協定世界時との差(単位: 分)
   *
   */
  constructor(
    peripheral: BleRemotePeripheral | null,
    timezoneOffsetMinute: number
  ) {
    // if (peripheral && !HEM_6233T.isDevice(peripheral)) {
    //   throw new Error("peripheral is not HEM_6233T");
    // }
    this._peripheral = peripheral;
    this._timezoneOffsetMinute = timezoneOffsetMinute;
  }

  /**
   * Connect to the device, get data, and then disconnect from the device
   *
   * You can get only data that the device has not yet sent
   *
   * デバイスに接続しデータを取得後、デバイスとの接続を切断
   *
   * 取得できるデータはデバイスが未送信のデータのみです
   *
   * @param pairingKeys pairing keys ペアリングキー
   *
   * @returns received data from the HEM_6233T HEM_6233Tから受け取ったデータ
   */
  public async getDataWait(pairingKeys?: string): Promise<HEM_6233TResult[]> {
    if (!this._peripheral) {
      throw new Error('HEM_6233T is not find.');
    }
    await this._peripheral.connectWait({
      autoDiscovery: true,
      pairingOption: {
        keys: pairingKeys,
      },
    });

    const results: any[] = [];
    const waitDisconnect = new Promise<HEM_6233TResult[]>((resolve, reject) => {
      this._peripheral!.ondisconnect = (reason: any) => {
        resolve(results);
      };
    });
    await this.subscribeWait('1805', '2A2B'); // current time
    await this.subscribeWait('180F', '2A19', async () => {
      // send command (unknown meaning)
      // In the command meaning, it should send to central from peripheral, but send to peripheral...?
      this._peripheral!.obnizBle.hci.write([
        0x02, // acl data

        0x00,
        0x00, // handle : 0  + flags : First Non-Automatically-Flushable packet  / ACL_START_NO_FLUSH

        0x09,
        0x00, // data length for acl : 9

        0x05,
        0x00, // data length for l2cap : 5

        0x04,
        0x00, // cid : 4 = ATT

        0x01, // opCode : 1 = OP_ERROR

        0x06, // error opcode : 6 = Find By Type Value Request

        0x01,
        0x00, // handle : 1 = ???

        0x0a, // error code : 10 = Attribute Not Found
      ]);

      this._writeTimeCharWait(this._timezoneOffsetMinute);
    }); // battery Level
    await this.subscribeWait('1810', '2A35', async (data: number[]) => {
      // console.log('SUCCESS', data);
      results.push(this._analyzeData(data));
    }); // blood pressure
    return await waitDisconnect;
  }

  /**
   * Execute a callback function when data is received from any service characteristic
   *
   * 任意のサービス・キャラクタティスティックからデータを受け取ると、コールバック関数を実行
   *
   * @param service service サービス
   *
   * @param char characteristic キャラクタリスティック
   *
   * @param callback callback function when received data
   * データを受け取ったときのコールバック関数
   */
  public async subscribeWait(service: string, char: string, callback?: any) {
    if (!this._peripheral) {
      throw new Error('HEM_6233T is not find.');
    }
    const characteristics = this._peripheral
      .getService(service)!
      .getCharacteristic(char)!;
    await characteristics.registerNotifyWait(async (data) => {
      if (callback) {
        callback(data);
      }
    });
  }

  /**
   * Set the current time
   *
   * 現在時刻を設定
   *
   * @param timeOffsetMinute difference from UTC (Unit: minutes) 協定世界時との差(単位: 分)
   */
  public async _writeTimeCharWait(timeOffsetMinute: number) {
    if (!this._peripheral) {
      throw new Error('HEM_6233T is not find.');
    }

    const timeChar = this._peripheral
      .getService('1805')!
      .getCharacteristic('2A2B')!;
    const date = new Date();
    date.setTime(Date.now() + 1000 * 60 * timeOffsetMinute);

    const buf = Buffer.alloc(7);
    buf.writeUInt16LE(date.getUTCFullYear(), 0);
    buf.writeUInt8(date.getUTCMonth() + 1, 2);
    buf.writeUInt8(date.getUTCDate(), 3);
    buf.writeUInt8(date.getUTCHours(), 4);
    buf.writeUInt8(date.getUTCMinutes(), 5);
    buf.writeUInt8(date.getUTCSeconds(), 6);

    const arr = Array.from(buf);
    await timeChar.writeWait(arr);
  }

  private _readFloatLE(buffer: Buffer, index: number) {
    const data = buffer.readUInt16LE(index);
    let mantissa = data & 0x0fff;
    if ((mantissa & 0x0800) > 0) {
      mantissa = -1 * (~(mantissa - 0x01) & 0x0fff);
    }
    const exponential = data >> 12;
    return mantissa * Math.pow(10, exponential);
  }

  private _readSFloatLE(buffer: Buffer, index: number) {
    const data = buffer.readUInt32LE(index);
    let mantissa = data & 0x00ffffff;
    if ((mantissa & 0x00800000) > 0) {
      mantissa = -1 * (~(mantissa - 0x01) & 0x00ffffff);
    }
    const exponential = data >> 24;
    return mantissa * Math.pow(10, exponential);
  }

  private _analyzeData(data: number[]): HEM_6233TResult {
    const buf = Buffer.from(data);
    const flags = buf.readUInt8(0);

    let index = 1;
    const result: HEM_6233TResult = {};
    let scale = 1;
    if (flags & 0x01) {
      // kPa
      scale = 7.501;
    }
    result.bloodPressure = {
      systolic: this._readFloatLE(buf, index) * scale,
      diastolic: this._readFloatLE(buf, index + 2) * scale,
      meanArterialPressure: this._readFloatLE(buf, index + 4) * scale,
      unit: 'mmHg',
    };
    index += 6;

    if (flags & 0x02) {
      // Time Stamp field present
      result.date = {
        year: buf.readUInt16LE(index),
        month: buf.readUInt8(index + 2),
        day: buf.readUInt8(index + 3),
        hour: buf.readUInt8(index + 4),
        minute: buf.readUInt8(index + 5),
        second: buf.readUInt8(index + 6),
      };
      index += 7;
    }
    if (flags & 0x04) {
      result.pulseRate = buf.readUInt16LE(index);
      index += 2;
    }

    if (flags & 0x08) {
      result.userId = buf.readUInt8(index);
      index += 1;
    }
    if (flags & 0x10) {
      const statusFlag: { [_: number]: HEM_6233TMeasurementStatus } = {
        0x01: 'BodyMovementDetection',
        0x02: 'CuffFitDetection',
        0x04: 'IrregularPulseDetection',
        0x08: 'PulseRateRangeDetection',
        0x10: 'MeasurementPositionDetection',
      };
      const measurementStatus = buf.readUInt16LE(index);
      index++;
      result.measurementStatus = [];

      for (const f in statusFlag) {
        if (+f & measurementStatus) {
          result.measurementStatus.push(statusFlag[f]);
        }
      }
    }
    return result;
  }
}
