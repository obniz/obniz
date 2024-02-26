/**
 * @packageDocumentation
 * @module Parts.D201
 */
/* eslint rulesdir/non-ascii: 0 */

import roundTo from 'round-to';
import { BleRemotePeripheral } from '../../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../../obniz/ObnizPartsBleInterface';
import { BleAdvBinaryAnalyzer } from '../../utils/advertisement/advertismentAnalyzer';

export interface D201Options {}

export interface D201Data {
  sendCount: number;
  atmosphericPressure: number;
  temperature: number;
  humidity: number;
  voltage: number;
  illuminance: number;
}
/**
 * Class that manages D201 series.
 *
 * D201シリーズを管理するクラス。
 */
export default class D201 implements ObnizPartsBleInterface {
  public _peripheral: BleRemotePeripheral | null = null;

  public static info(): ObnizPartsBleInfo {
    return {
      name: 'D201',
    };
  }

  /**
   * Verify that the received peripheral is from the D201.
   *
   * 受け取ったPeripheralがD201シリーズのものかどうかを確認する。
   *
   * @param peripheral Instance of BleRemotePeripheral. BleRemotePeripheralのインスタンス。
   *
   * @returns Whether it is the D201 or not. D201かどうか。
   *
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return this._d201AdvAnalyzer.validate(peripheral.adv_data);
  }

  public static getData(peripheral: BleRemotePeripheral): D201Data | null {
    if (!this.isDevice(peripheral)) return null;

    const sendCountByte = this._d201AdvAnalyzer.getData(
      peripheral.adv_data,
      'manufacture',
      'sendCount'
    );
    const atmosphericPressureBytes = this._d201AdvAnalyzer.getData(
      peripheral.adv_data,
      'manufacture',
      'atmosphericPressure'
    );
    const temperatureBytes = this._d201AdvAnalyzer.getData(
      peripheral.adv_data,
      'manufacture',
      'temperature'
    );
    const humidityBytes = this._d201AdvAnalyzer.getData(
      peripheral.adv_data,
      'manufacture',
      'humidity'
    );
    const voltageBytes = this._d201AdvAnalyzer.getData(
      peripheral.adv_data,
      'manufacture',
      'voltage'
    );
    const illuminanceBytes = this._d201AdvAnalyzer.getData(
      peripheral.adv_data,
      'manufacture',
      'illuminance'
    );
    if (
      !sendCountByte ||
      !atmosphericPressureBytes ||
      !temperatureBytes ||
      !humidityBytes ||
      !humidityBytes ||
      !voltageBytes ||
      !illuminanceBytes
    ) {
      return null;
    }

    const sendCount = sendCountByte[0];
    const atmosphericPressure = roundTo(
      Buffer.from(atmosphericPressureBytes).readInt32LE(0) / 100,
      2
    );
    const temperature = roundTo(
      Buffer.from(temperatureBytes).readInt32LE(0) / 100,
      2
    );
    const humidity = roundTo(
      Buffer.from(humidityBytes).readInt32LE(0) / 1024,
      6
    );
    const adc = Buffer.from(voltageBytes).readInt16LE(0);
    const voltage = roundTo(adc * (2.03 / 65535) * 3, 15); // round-to内で切られてるので14桁になる
    const illuminanceExponent = parseInt(
      illuminanceBytes[0].toString(16)[0],
      10
    );
    const illuminanceMantissa = parseInt(
      illuminanceBytes
        .map((v) => v.toString(16).padStart(2, '0'))
        .join('')
        .slice(1),
      16
    );
    let illuminance = 2 ** illuminanceExponent * 0.01 * illuminanceMantissa;
    illuminance = roundTo(
      illuminance < 350
        ? 2.1242 * illuminance + 0
        : 1.0692 * illuminance + 388.24,
      2
    );

    return {
      sendCount,
      atmosphericPressure,
      temperature,
      humidity,
      voltage,
      illuminance,
    };
  }

  private static _d201AdvAnalyzer = new BleAdvBinaryAnalyzer()
    .addTarget('flags', [0x02, 0x01, 0x04]) // DATA 1-3
    .addTarget('localNameDataLength', [0x05]) // DATA 4
    .addTarget('localNameAdType', [0x09]) // DATA 5
    .addTargetByLength('localName', 4) // DATA 6-9
    .groupStart('manufacture')
    .addTarget('length', [0x15]) // DATA 10
    .addTarget('type', [0xff]) // DATA 11
    .addTarget('companyId', [0x5f, 0x06]) // DATA 12-13
    .addTarget('deviceType', [0x91]) // DATA 14, 0x01(過去モデル, 未対応) / 0x91(D201/D202) / 0x92(D101)
    .addTargetByLength('sendCount', 1) // DATA 15
    .addTargetByLength('atmosphericPressure', 4) // DATA 16-19, Little Endian
    .addTargetByLength('temperature', 4) // DATA 20-23, Little Endian
    .addTargetByLength('humidity', 4) // DATA 24-27, Little Endian
    .addTargetByLength('voltage', 2) // DATA 28-29, Little Endian
    .addTargetByLength('illuminance', 2) // DATA 30-31, ちょっと特殊
    .groupEnd();
}
