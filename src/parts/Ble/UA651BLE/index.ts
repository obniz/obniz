/**
 * @packageDocumentation
 * @module Parts.UA651BLE
 */
/* eslint rulesdir/non-ascii: 0 */

import { BleRemoteCharacteristic } from '../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';
import { BleBatteryService } from '../utils/services/batteryService';
import { BleGenericAccess } from '../utils/services/genericAccess';
import {UUID128, UUID16} from "../../../obniz/libs/embeds/bleHci/bleTypes";

export interface UA651BLEOptions {}

/**
 * blood pressure data from UA651BLE
 *
 * (blood pressure will return either mmHg or kPa unit)
 *
 * UA651BLEからの血圧データ
 *
 * (血圧はmmHg形式化かkPa形式のどちらかが返ってきます)
 */
export interface UA651BLEResult {
  /**
   * systolic pressure 最高血圧
   *
   * Range 範囲: 0~299 (Unit 単位: 1 mmHg)
   */
  SystolicPressure_mmHg?: number; // ex) 128mmHg -> 0x80 = 128, 0x00
  /**
   * diastolic pressure 最低血圧
   *
   * Range 範囲: 0~299 (Unit 単位: 1 mmHg)
   */
  DiastolicPressure_mmHg?: number;
  /**
   * mean arterial pressure 平均血圧
   *
   * Range 範囲: 0~299 (Unit 単位: 1 mmHg)
   */
  MeanArterialPressure_mmHg?: number;
  /** systolic pressure 最高血圧 (Unit 単位: 0.1 kPa) */
  SystolicPressure_kPa?: number; // ex) 17.6Kpa -> 0xB0 = 176, 0xF0
  /** diastolic pressure 最低血圧 (Unit 単位: 0.1 kPa) */
  DiastolicPressure_kPa?: number;
  /** mean arterial pressure 平均血圧 (Unit 単位: 0.1 kPa) */
  MeanArterialPressure_kPa?: number;
  /** body moved or not 体が動いたかどうか */
  bodyMoved?: boolean;
  /** cuff is loose or not カフが緩いかどうか */
  cuffFitLoose?: boolean;
  /** irregular pulse detected or not 不整脈が検出されたかどうか */
  irregularPulseDetected?: boolean;
  /** measurement position is improper or not 測定位置が不適切であるか */
  improperMeasurement?: boolean;
  /**
   * pulse rate 脈拍数
   *
   * Range 範囲: 40~180 (Unit 単位: 1 bpm)
   */
  PulseRate?: number;
  /** timestamp タイムスタンプ */
  date?: {
    // Time Stamp ex) 2013/8/26 9:10:20 -> 0xDD 0x07 0x08 0x1A 0x09 0x0A 0x14
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };

  /**
   * battery(%) バッテリー(%)
   *
   * Value 値: 100 | 66 | 40 | 33
   */
  battery?: number;
}

/** UA651BLE management class UA651BLEを管理するクラス */
export default class UA651BLE implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'UA651BLE',
    };
  }

  /**
   * Verify that the received peripheral is from the UA651BLE
   *
   * 受け取ったPeripheralがUA651BLEのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is UA651BLE
   *
   * UA651BLEかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral) {
    return (
      peripheral.localName && peripheral.localName.startsWith('A&D_UA-651BLE_')
    );
  }

  public onNotify?: (co2: number) => void;
  public _peripheral: BleRemotePeripheral;
  public ondisconnect?: (reason: any) => void;
  public genericAccess?: BleGenericAccess;
  public batteryService?: BleBatteryService;
  private _timezoneOffsetMinute: number;

  constructor(peripheral: BleRemotePeripheral, timezoneOffsetMinute: number) {
    if (!peripheral) {
      throw new Error('no peripheral');
    }
    this._peripheral = peripheral;
    this._timezoneOffsetMinute = timezoneOffsetMinute;
  }

  public isPairingMode() {
    if (!this._peripheral) {
      throw new Error('UA651BLE not found');
    }

    // adv_data[2]はFlagsで、bit0が1の場合Pairng Mode(Limited Discoverable Mode)
    if (this._peripheral.adv_data[2] === 5) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Pair with the device
   *
   * デバイスとペアリング
   *
   * @returns pairing key ペアリングキー
   */
  public async pairingWait(): Promise<string | null> {
    if (!this._peripheral) {
      throw new Error('UA651BLE not found');
    }
    this._peripheral.ondisconnect = (reason: any) => {
      if (typeof this.ondisconnect === 'function') {
        this.ondisconnect(reason);
      }
    };
    // let key: string | null = null;
    await this._peripheral.connectWait({
      pairingOption: {
        onPairedCallback: (pairingKey) => {
          // console.log('pairied ' + pairingKey);
        },
      },
      waitUntilPairing: true,
      retry: 3,
    });
    const keys = await this._peripheral.getPairingKeysWait();
    if (!keys) {
      throw new Error('UA651BLE pairing failed');
    }

    const {
      bloodPressureMeasurementChar,
      timeChar,
      customServiceChar,
    } = this._getChars();

    try {
      // 自動切断されてるかもしれない
      await this._writeTimeCharWait(this._timezoneOffsetMinute);
      await customServiceChar.writeWait([2, 1, 3]); // disconnect req
    } catch (e) {
      // do nothing
    }
    try {
      if (this._peripheral.connected) {
        await this._peripheral.disconnectWait();
      }
    } catch (e) {
      // do nothing
    }
    return keys;
  }

  /**
   * Get data from the UA651BLE
   *
   * UA651BLEからデータを取得
   *
   * @returns data from the UA651BLE UA651BLEから受け取ったデータ
   */
  public async getDataWait(pairingKeys?: string): Promise<UA651BLEResult[]> {
    if (!this._peripheral) {
      throw new Error('UA651BLE not found');
    }
    await this._peripheral.connectWait({
      pairingOption: {
        keys: pairingKeys,
      },
    });

    if (!this._peripheral) {
      throw new Error('UA651BLE not found');
    }
    const results: UA651BLEResult[] = [];
    const {
      bloodPressureMeasurementChar,
      timeChar,
      customServiceChar,
      batteryChar,
    } = this._getChars();

    const waitDisconnect = new Promise<UA651BLEResult[]>((resolve, reject) => {
      if (!this._peripheral) return;
      this._peripheral.ondisconnect = (reason: any) => {
        resolve(results);
      };
    });

    const battery = await batteryChar.readWait();

    await customServiceChar.writeWait([2, 0, 0xe1]); // send all data
    await this._writeTimeCharWait(this._timezoneOffsetMinute);

    await bloodPressureMeasurementChar.registerNotifyWait((data: number[]) => {
      results.push(this._analyzeData(data, battery));
    });

    return waitDisconnect;
  }

  private _readSFLOAT_LE(buffer: Buffer, index: number) {
    const data = buffer.readUInt16LE(index);
    let mantissa = data & 0x0fff;
    if ((mantissa & 0x0800) > 0) {
      mantissa = -1 * (~(mantissa - 0x01) & 0x0fff);
    }
    const exponential = data >> 12;
    return mantissa * Math.pow(10, exponential);
  }

  private _analyzeData(data: number[], battery: number[]): UA651BLEResult {
    const buf = Buffer.from(data);
    const flags = buf.readUInt8(0);

    let index = 1;
    const result: UA651BLEResult = {};

    if (flags & 0x01) {
      // Blood Pressure Unit Flag
      // kPa
      result.SystolicPressure_kPa = this._readSFLOAT_LE(buf, index);
      index += 2;
      result.DiastolicPressure_kPa = this._readSFLOAT_LE(buf, index);
      index += 2;
      result.MeanArterialPressure_kPa = this._readSFLOAT_LE(buf, index);
      index += 2;
    } else {
      // mmHg
      result.SystolicPressure_mmHg = this._readSFLOAT_LE(buf, index);
      index += 2;
      result.DiastolicPressure_mmHg = this._readSFLOAT_LE(buf, index);
      index += 2;
      result.MeanArterialPressure_mmHg = this._readSFLOAT_LE(buf, index);
      index += 2;
    }
    if (flags & 0x02) {
      // // Time Stamp Flag
      // TODO: get Time Stamp
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
      // Pulse Rate Flag
      result.PulseRate = this._readSFLOAT_LE(buf, index);
      index += 2;
    }
    if (flags & 0x08) {
      // UserIdFlag
      index += 1;
    }
    if (flags & 0x10) {
      // UserIdFlag
      const ms = buf[index];
      result.bodyMoved = (ms & 0b1) !== 0;
      result.cuffFitLoose = (ms & 0b10) !== 0;
      result.irregularPulseDetected = (ms & 0b100) !== 0;
      result.improperMeasurement = (ms & 0b100000) !== 0;
      index += 1;
    }

    result.battery = battery[0];
    return result;
  }

  private _getChars() {
    if (!this._peripheral) {
      throw new Error('UA651BLE not found');
    }

    const bloodPressureMeasurementChar: BleRemoteCharacteristic = this._peripheral
      .getService('1810'as UUID16)!
      .getCharacteristic('2A35'as UUID16)!;
    const timeChar = this._peripheral
      .getService('1810' as UUID16)!
      .getCharacteristic('2A08' as UUID16)!;
    const customServiceChar = this._peripheral
      .getService('233bf0005a341b6d975c000d5690abe4' as UUID128)! // Primary Service Custom Service(pp.14)
      .getCharacteristic('233bf0015a341b6d975c000d5690abe4' as UUID128)!; // Custom Characteristic(pp.14)
    const batteryChar = this._peripheral
      .getService('180F' as UUID16)!
      .getCharacteristic('2A19' as UUID16)!;

    return {
      bloodPressureMeasurementChar,
      timeChar,
      customServiceChar,
      batteryChar,
    };
  }

  private async _writeTimeCharWait(timeOffsetMinute: number) {
    const { timeChar } = this._getChars();

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
}
