/**
 * @packageDocumentation
 * @module Parts.D101
 */
/* eslint rulesdir/non-ascii: 0 */

import roundTo from 'round-to';
import { BleRemotePeripheral } from '../../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../../obniz/ObnizPartsBleInterface';
import { BleAdvBinaryAnalyzer } from '../../utils/advertisement/advertismentAnalyzer';

export interface D101Options {}

interface D101Data_1 {
  sendCount: number;
  atmosphericPressure: number;
  temperature: number;
  humidity: number;
  voltage: number;
  illuminance: number;
}

interface D101Data_2 {
  co2: number;
}

export type D101Data = D101Data_1 | D101Data_2;

/**
 * Class that manages D101 series.
 *
 * D101シリーズを管理するクラス。
 */
export default class D101 implements ObnizPartsBleInterface {
  public _peripheral: BleRemotePeripheral | null = null;

  public static info(): ObnizPartsBleInfo {
    return {
      name: 'D101',
    };
  }

  /**
   * Verify that the received peripheral is from the D101.
   *
   * 受け取ったPeripheralがD101シリーズのものかどうかを確認する。
   *
   * @param peripheral Instance of BleRemotePeripheral. BleRemotePeripheralのインスタンス。
   *
   * @returns Whether it is the D101 or not. D101かどうか。
   *
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return (
      this._D201AdvAnalyzer.validate(peripheral.adv_data) ||
      this._D101CO2AdvAnalyzer.validate(peripheral.adv_data)
    );
  }

  public static getData(peripheral: BleRemotePeripheral): D101Data | null {
    if (!this.isDevice(peripheral)) return null;

    if (this._D201AdvAnalyzer.validate(peripheral.adv_data)) {
      const sendCountByte = this._D201AdvAnalyzer.getData(
        peripheral.adv_data,
        'manufacture',
        'sendCount'
      );
      const atmosphericPressureBytes = this._D201AdvAnalyzer.getData(
        peripheral.adv_data,
        'manufacture',
        'atmosphericPressure'
      );
      const temperatureBytes = this._D201AdvAnalyzer.getData(
        peripheral.adv_data,
        'manufacture',
        'temperature'
      );
      const humidityBytes = this._D201AdvAnalyzer.getData(
        peripheral.adv_data,
        'manufacture',
        'humidity'
      );
      const voltageBytes = this._D201AdvAnalyzer.getData(
        peripheral.adv_data,
        'manufacture',
        'voltage'
      );
      const illuminanceBytes = this._D201AdvAnalyzer.getData(
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
        Buffer.from(atmosphericPressureBytes).readUInt32LE(0) / 100,
        2
      );
      const temperature = roundTo(
        Buffer.from(temperatureBytes).readUInt32LE(0) / 100,
        2
      );
      const humidity = roundTo(
        Buffer.from(humidityBytes).readUInt32LE(0) / 1024,
        6
      );
      const adc = Buffer.from(voltageBytes).readUInt16LE(0);
      const voltage = roundTo(adc * (3.3 / 65535) * 3, 15); // round-to内で切られてるので14桁になる
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
    } else if (this._D101CO2AdvAnalyzer.validate(peripheral.adv_data)) {
      const sendCountByte = this._D101CO2AdvAnalyzer.getData(
        peripheral.adv_data,
        'manufacture',
        'sendCount'
      );
      const co2Bytes = this._D101CO2AdvAnalyzer.getData(
        peripheral.adv_data,
        'manufacture',
        'co2'
      );

      if (!sendCountByte || !co2Bytes) return null;

      const sendCount = sendCountByte[0];
      const co2 = Buffer.from(co2Bytes).readUInt16BE(0);

      return {
        sendCount,
        co2,
      };
    }

    return null;
  }

  private static _D201AdvAnalyzer = new BleAdvBinaryAnalyzer()
    .addTarget('flags', [0x02, 0x01, 0x04]) // DATA 1-3
    .addTarget('localNameDataLength', [0x05]) // DATA 4
    .addTarget('localNameAdType', [0x09]) // DATA 5
    .addTargetByLength('localName', 4) // DATA 6-9
    .groupStart('manufacture')
    .addTarget('length', [0x15]) // DATA 10
    .addTarget('type', [0xff]) // DATA 11
    .addTarget('companyId', [0x5f, 0x06]) // DATA 12-13
    .addTarget('deviceType', [0x92]) // DATA 14, 0x01(過去モデル, 未対応) / 0x91(D201/D202) / 0x92(D101)
    .addTargetByLength('sendCount', 1) // DATA 15
    .addTargetByLength('atmosphericPressure', 4) // DATA 16-19, Little Endian
    .addTargetByLength('temperature', 4) // DATA 20-23, Little Endian
    .addTargetByLength('humidity', 4) // DATA 24-27, Little Endian
    .addTargetByLength('voltage', 2) // DATA 28-29, Little Endian
    .addTargetByLength('illuminance', 2) // DATA 30-31, ちょっと特殊
    .groupEnd();

  private static _D101CO2AdvAnalyzer = new BleAdvBinaryAnalyzer()
    .addTarget('flags', [0x02, 0x01, 0x04]) // DATA 1-3
    .addTarget('localNameDataLength', [0x05]) // DATA 4
    .addTarget('localNameAdType', [0x09]) // DATA 5
    .addTargetByLength('localName', 4) // DATA 6-9
    .groupStart('manufacture')
    .addTarget('length', [0x07]) // DATA 10
    .addTarget('type', [0xff]) // DATA 11
    .addTarget('companyId', [0x5f, 0x06]) // DATA 12-13
    .addTarget('deviceType', [0x92]) // DATA 14, 0x01(過去モデル, 未対応) / 0x91(D201/D202) / 0x92(D101)
    .addTargetByLength('sendCount', 1) // DATA 15
    .addTargetByLength('co2', 2) // DATA 16-17, Big Endian
    .groupEnd();
}
