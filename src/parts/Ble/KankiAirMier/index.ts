/**
 * @packageDocumentation
 * @module Parts.KankiAirMier
 */
/* eslint rulesdir/non-ascii: 0 */

// import {BleRemotePeripheral, ObnizPartsBleInterface, ObnizPartsBleInfo} from 'obniz';

import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';
import { BleAdvBinaryAnalyzer } from '../utils/advertisement/advertismentAnalyzer';
import roundTo from 'round-to';

export interface KankiAirMierOptions {}

/**
 * advertisement data from Kanki AirMier
 *
 * 換気エアミエルからのadvertisementデータ
 */
export interface KankiAirMier_Data {
  /**
   * CO2 concentration CO2濃度
   *
   * Range 範囲: 0~10000 (Unit 単位: 1 ppm)
   */
  co2: number;
  /** temperature 温度 (Unit 単位: 0.1 degC) */
  temperature: number;
  /** relative humidity 相対湿度 (Unit 単位: 0.1 %RH) */
  humidity: number;
  /**
   * sequence number (count up each time remeasuring)
   *
   * シーケンス番号 (再計測のたびにカウントアップする)
   *
   * Range 範囲: 1~7
   *
   * 0 at startup, repeat 1~7 thereafter
   *
   * 起動時0、それ以降1~7を繰り返す
   */
  sequenceNumber: number;
  /** device name デバイス名 */
  deviceName: string;
}

/** Kanki AirMier management class 換気エアミエルを管理するクラス */
export default class KankiAirMier implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'KankiAirMier',
    };
  }

  /**
   * Verify that the received peripheral is from the Kanki AirMier
   *
   * 受け取ったPeripheralが換気エアミエルのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the Kanki AirMier
   *
   * 換気エアミエルかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return KankiAirMier._deviceAdvAnalyzer.validate(peripheral.adv_data);
  }

  /**
   * Get a data from the Kanki AirMier
   *
   * 換気エアミエルからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the Kanki AirMier 換気エアミエルから受け取ったデータ
   */
  public static getData(
    peripheral: BleRemotePeripheral
  ): KankiAirMier_Data | null {
    if (!KankiAirMier.isDevice(peripheral)) {
      return null;
    }
    const allData = KankiAirMier._deviceAdvAnalyzer.getAllData(
      peripheral.adv_data
    );
    if (!allData) {
      return null;
    }

    const temperatureRaw = Buffer.from(
      allData.manufacture.temperature
    ).readInt16LE(0);
    const co2Raw = Buffer.from(allData.manufacture.co2).readInt16LE(0);
    const humidityRaw = Buffer.from(allData.manufacture.humidity).readInt16LE(
      0
    );
    const sequenceNumber = allData.manufacture.sequence[0] >> 5;
    const deviceName = Buffer.from(allData.manufacture.deviceName).toString(
      'utf8'
    );
    return {
      co2: co2Raw,
      temperature: roundTo(temperatureRaw / 10, 1),
      humidity: roundTo(humidityRaw / 10, 1),
      sequenceNumber,
      deviceName,
    };
  }

  private static _deviceAdvAnalyzer = new BleAdvBinaryAnalyzer()
    .groupStart('manufacture')
    .addTarget('length', [0x1e])
    .addTarget('type', [0xff])
    .addTarget('companyId', [0x9e, 0x09])
    .addTarget('appearance', [0x01])
    .addTarget('co2', [-1, -1])
    .addTarget('temperature', [-1, -1])
    .addTarget('humidity', [-1, -1])
    .addTarget('battery', [0xfe])
    .addTarget('interval', [0x02, 0x00])
    .addTarget('sequence', [-1])
    .addTarget('firmwareVersion', [-1])
    .addTargetByLength('deviceName', 15) // from datasheet length=14, but device send length=13
    .groupEnd();

  public _peripheral: BleRemotePeripheral | null = null;
}
