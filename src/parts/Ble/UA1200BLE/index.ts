/**
 * @packageDocumentation
 * @module Parts.UA1200BLE
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

export interface UA1200BLEOptions {}

/**
 * blood pressure data from UA651BLE
 *
 * (blood pressure will return either mmHg or kPa unit)
 *
 * UA1200BLEからの血圧データ
 *
 * (血圧はmmHg形式かkPa形式のどちらかが返ってきます)
 */
export interface UA1200BLEResult {
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
}

/** UA1200BLE management class UA1200BLEを管理するクラス */
export default class UA1200BLE implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'UA1200BLE',
    };
  }

  /**
   * Verify that the received peripheral is from the UA1200BLE
   *
   * 受け取ったPeripheralがUA1200BLEのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is UA1200BLE
   *
   * UA1200BLEかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral) {
    return (
      peripheral.localName && peripheral.localName.startsWith('UA-1200BLE_')
    );
  }

  /**
   * Judge whether it is cooperation mode
   *
   * (When in cooperation mode, no data exists even when connected)
   *
   * 連携モードかどうかの判定
   *
   * (連携モードのときは接続してもデータが存在しません)
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is cooperation mode or not
   *
   * 連携モードかどうか
   */
  public static isCooperationMode(peripheral: BleRemotePeripheral) {
    const peripheralHex = peripheral.adv_data
      .map((e) => e.toString(16))
      .join('');
    const peripheralArray: string = [
      // "2",
      // "1",
      // "6",
      // "11",
      // "7",
      'e4',
      'ab',
      '90',
      '56',
      'd',
      '0',
      '5c',
      '97',
      '6d',
      '1b',
      '34',
      '5a',
      '0',
      'f0',
      '3b',
      '23',
      // "5",
      // "ff",
      // "69",
      // "0",
      // "0",
      // "ff",
    ].join('');
    return peripheralHex.indexOf(peripheralArray) > -1;
  }

  public onNotify?: (co2: number) => void;
  public _peripheral: BleRemotePeripheral | null;
  public ondisconnect?: (reason: any) => void;
  public genericAccess?: BleGenericAccess;
  public batteryService?: BleBatteryService;
  public _modeFlag?: boolean;
  private _timezoneOffsetMinute: number;

  constructor(
    peripheral: BleRemotePeripheral | null,
    timezoneOffsetMinute: number
  ) {
    if (!peripheral || !UA1200BLE.isDevice(peripheral)) {
      throw new Error('peripheral is not UA1200BLE');
    }
    this._peripheral = peripheral;
    this._timezoneOffsetMinute = timezoneOffsetMinute;
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
      throw new Error('UA1200BLE not found');
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

    const { customServiceChar } = this._getCharsCoopMode();

    await customServiceChar.writeWait([2, 1, 3]); // disconnect req
    return key;
  }

  /**
   * Get data from the UA1200BLE
   *
   * UA1200BLEからデータを取得
   *
   * @returns data from the UA1200BLE UA1200BLEから受け取ったデータ
   */
  public async getDataWait(): Promise<UA1200BLEResult[]> {
    if (!this._peripheral) {
      throw new Error('UA1200BLE not found');
    }

    this._peripheral.ondisconnect = (reason) => {
      if (this.ondisconnect) {
        this.ondisconnect(reason);
      }
    };
    await this._peripheral.connectWait();

    if (!this._peripheral) {
      throw new Error('UA1200BLE not found');
    }
    const results: UA1200BLEResult[] = [];

    // Advertise mode (BP-00 or BP-01 in pp.7)
    // const { bloodPressureMeasurementChar, customServiceChar } = this._getCharsCoopMode();
    // await customServiceChar.writeWait([2, 0, 0xe1]);
    // bloodPressureMeasurementChar.registerNotifyWait((data: number[]) => {
    //   results.push(this._analyzeData(data));
    // });
    // await this._writeTimeCharWait(this._timezoneOffsetMinute);
    // await this._writeCCCDChar();

    const {
      bloodPressureMeasurementChar,
      timeChar,
    } = this._getCharsSingleMode();
    await this._writeTimeCharWait(this._timezoneOffsetMinute);
    await bloodPressureMeasurementChar.registerNotifyWait((data: number[]) => {
      results.push(this._analyzeData(data));
    });

    return await new Promise((resolve, reject) => {
      if (!this._peripheral) return;
      this._peripheral.ondisconnect = (reason) => {
        resolve(results);
        if (this.ondisconnect) {
          this.ondisconnect(reason);
        }
      };
    });
  }

  private _readSFLOAT_LE(buffer: Buffer, index: number) {
    // convert SFLOAT Little Endian (not sfloat!) to numerical value
    const data = buffer.readUInt16LE(index);
    let mantissa = data & 0x0fff;
    if ((mantissa & 0x0800) > 0) {
      mantissa = -1 * (~(mantissa - 0x01) & 0x0fff);
    }
    const exponential = data >> 12;
    return mantissa * Math.pow(10, exponential);
  }

  private _analyzeData(data: number[]): UA1200BLEResult {
    const buf = Buffer.from(data);
    const flags = buf.readUInt8(0);

    let index = 1;
    const result: UA1200BLEResult = {};
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
      // Time Stamp Flag
      // TODO: get Time stamp
      // result.date = {
      //   year: buf.readUInt16LE(index),
      //   month: buf.readUInt8(index + 2),
      //   day: buf.readUInt8(index + 3),
      //   hour: buf.readUInt8(index + 4),
      //   minute: buf.readUInt8(index + 5),
      //   second: buf.readUInt8(index + 6),
      // };
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

    return result;
  }

  private _getCharsCoopMode() {
    if (!this._peripheral) {
      throw new Error('UA1200BLE not found');
    }

    const bloodPressureMeasurementChar: BleRemoteCharacteristic = this._peripheral
      .getService('1810')!
      .getCharacteristic('2A35')!;
    const customServiceChar = this._peripheral
      .getService('233bf0005a341b6d975c000d5690abe4')! // Primary Service Custom Service(pp.26)
      .getCharacteristic('233bf0015a341b6d975c000d5690abe4')!; // Custom Characteristic(pp.27)

    return {
      bloodPressureMeasurementChar,
      customServiceChar,
    };
  }

  private _getCharsSingleMode() {
    if (!this._peripheral) {
      throw new Error('UA1200BLE not found');
    }

    const bloodPressureMeasurementChar: BleRemoteCharacteristic = this._peripheral
      .getService('1810')!
      .getCharacteristic('2A35')!;
    const timeChar = this._peripheral
      .getService('1805')!
      .getCharacteristic('2A2B')!;
    // const CCCDChar = this._peripheral.getService("1810")!.getCharacteristic("2902")!;

    return {
      bloodPressureMeasurementChar,
      timeChar,
      // CCCDChar,
    };
  }

  private async _writeTimeCharWait(timeOffsetMinute: number) {
    const { timeChar } = this._getCharsSingleMode();

    const date = new Date();
    date.setTime(Date.now() + 1000 * 60 * timeOffsetMinute);
    const buf = Buffer.alloc(9);
    // Current Time Service(pp.11)
    buf.writeUInt16LE(date.getUTCFullYear(), 0);
    buf.writeUInt8(date.getUTCMonth() + 1, 2);
    buf.writeUInt8(date.getUTCDate(), 3);
    buf.writeUInt8(date.getUTCHours(), 4);
    buf.writeUInt8(date.getUTCMinutes(), 5);
    buf.writeUInt8(date.getUTCSeconds(), 6);
    buf.writeUInt8(date.getDay(), 7);
    buf.writeUInt8(0, 8);

    const arr = Array.from(buf);
    await timeChar.writeWait(arr);
  }

  // private async _writeCCCDChar() {
  //   const { CCCDChar } = this._getCharsSingleMode();
  //   await CCCDChar.writeWait([512]);
  // }
}
