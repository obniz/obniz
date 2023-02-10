/**
 * @packageDocumentation
 * @module Parts.UT201BLE
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

export interface UT201BLEOptions {}

/**
 * body temperature data from UT201BLE
 *
 * (body temperature will be returned in either Fahrenheit or Celsius format)
 *
 * UT201BLEからの体温データ
 *
 * (体温はFahrenheit形式かCelsius形式のどちらかが返ってきます)
 */
export interface UT201BLEResult {
  /**
   * body temperature in Fahrenheit format Fahrenheit形式の体温
   *
   * (Unit 単位: 0.1 degF)
   */
  fahrenheit?: number;
  /**
   * body temperature in Celsius format Celsius形式の体温
   *
   * Range 範囲: 32.00~42.00 (Unit 単位: 0.01 degC)
   */
  celsius?: number;
  /** timestamp タイムスタンプ */
  date?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
  /**
   * part where body temperature was measured 体温の計測部位
   *
   * Value 値: 'unknown' | 'Armpit' | 'Body' | 'Ear' | 'Finger' | 'Gastro-intestinal Tract' | 'Mouth' | 'Rectum' | 'Toe' | 'Tympanum'
   */
  temperatureType?: string;

  /**
   * battery(%) バッテリー(%)
   *
   * Value 値: 100 | 66 | 40 | 33
   */
  battery?: number;
}

/** UT201BLE management class UT201BLEを管理するクラス */
export default class UT201BLE implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'UT201BLE',
    };
  }

  /**
   * Verify that the received peripheral is from the UT201BLE
   *
   * 受け取ったPeripheralがUT201BLEのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is UT201BLE
   *
   * UT201BLEかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral) {
    return (
      peripheral.localName && peripheral.localName.startsWith('A&D_UT201BLE_')
    );
  }

  public onNotify?: (co2: number) => void;
  public _peripheral: BleRemotePeripheral | null;
  public ondisconnect?: (reason: any) => void;
  public genericAccess?: BleGenericAccess;
  public batteryService?: BleBatteryService;
  private _timezoneOffsetMinute: number;

  constructor(
    peripheral: BleRemotePeripheral | null,
    timezoneOffsetMinute: number
  ) {
    if (!peripheral || !UT201BLE.isDevice(peripheral)) {
      throw new Error('peripheral is not UT201BLE');
    }
    this._peripheral = peripheral;
    this._timezoneOffsetMinute = timezoneOffsetMinute;
  }

  public isPairingMode() {
    if (!this._peripheral) {
      throw new Error('UT201BLE not found');
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
      throw new Error('UT201BLE not found');
    }
    this._peripheral.ondisconnect = (reason: any) => {
      if (typeof this.ondisconnect === 'function') {
        this.ondisconnect(reason);
      }
    };
    let key: string | null = null;
    await this._peripheral.connectWait({
      pairingOption: {
        onPairedCallback: (pairingKey) => {
          key = pairingKey;
        },
      },
    });

    const { timeChar, customServiceChar } = this._getChars();

    await this._writeTimeCharWait(this._timezoneOffsetMinute);

    // await customServiceChar.writeWait([2, 1, 3]); // disconnect req
    return key;
  }

  /**
   * Get data from the UT201BLE
   *
   * UT201BLEからデータを取得
   *
   * @param pairingKeys pairing key ペアリングキー
   *
   * @returns data from the UT201BLE UT201BLEから受け取ったデータ
   */
  public async getDataWait(pairingKeys?: string): Promise<UT201BLEResult[]> {
    if (!this._peripheral) {
      throw new Error('UT201BLE not found');
    }

    await this._peripheral.connectWait({
      pairingOption: {
        keys: pairingKeys,
      },
    });

    if (!this._peripheral) {
      throw new Error('UT201BLE not found');
    }
    const results: UT201BLEResult[] = [];
    const {
      temperatureMeasurementChar,
      timeChar,
      customServiceChar,
      batteryChar,
    } = this._getChars();

    const waitDisconnect = new Promise<UT201BLEResult[]>((resolve, reject) => {
      if (!this._peripheral) return;
      this._peripheral.ondisconnect = (reason: any) => {
        resolve(results);
      };
    });

    const battery = await batteryChar.readWait();

    await customServiceChar.writeWait([2, 0, 0xe1]); // send all data

    await this._writeTimeCharWait(this._timezoneOffsetMinute);

    await temperatureMeasurementChar.registerNotifyWait((data: number[]) => {
      results.push(this._analyzeData(data, battery));
    });

    return await waitDisconnect;
  }

  private _readFloatLE(buffer: Buffer, index: number) {
    const data = buffer.readUInt32LE(index);
    let mantissa = data & 0x00ffffff;
    if ((mantissa & 0x00800000) > 0) {
      mantissa = -1 * (~(mantissa - 0x01) & 0x00ffffff);
    }
    const exponential = data >> 24;
    return mantissa * Math.pow(10, exponential);
  }

  private _analyzeData(data: number[], battery: number[]): UT201BLEResult {
    const buf = Buffer.from(data);
    const flags = buf.readUInt8(0);

    let index = 1;
    const result: UT201BLEResult = {};
    if (flags & 0x01) {
      // Fahrenheit
      result.fahrenheit = this._readFloatLE(buf, index);
      index += 4;
    } else {
      // Celsius
      result.celsius = this._readFloatLE(buf, index);
      index += 4;
    }
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
      const types = [
        'unknown',
        'Armpit',
        'Body',
        'Ear',
        'Finger',
        'Gastro-intestinal Tract',
        'Mouth',
        'Rectum',
        'Toe',
        'Tympanum',
      ];
      const value = buf.readUInt8(index);
      index++;
      result.temperatureType = types[value] || 'unknown';
      result.battery = battery[0];
    }

    return result;
  }

  private _getChars() {
    if (!this._peripheral) {
      throw new Error('UT201BLE not found');
    }

    const temperatureMeasurementChar: BleRemoteCharacteristic = this._peripheral
      .getService('1809')!
      .getCharacteristic('2A1C')!;
    const timeChar = this._peripheral
      .getService('1809')!
      .getCharacteristic('2A08')!;
    const customServiceChar = this._peripheral
      .getService('233bf0005a341b6d975c000d5690abe4')!
      .getCharacteristic('233bf0015a341b6d975c000d5690abe4')!;
    const batteryChar = this._peripheral
      .getService('180F')!
      .getCharacteristic('2A19')!;

    return {
      temperatureMeasurementChar,
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
