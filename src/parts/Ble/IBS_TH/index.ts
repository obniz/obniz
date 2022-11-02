/**
 * @packageDocumentation
 * @module Parts.IBS_TH
 */
/* eslint rulesdir/non-ascii: 0 */

import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';
import { BleAdvBinaryAnalyzer } from '../utils/advertisement/advertismentAnalyzer';

export interface IBS_THOptions {}

/**
 * advertisement data from IBS_TH
 *
 * IBS_THからのadvertisementデータ
 */
export interface IBS_TH_Data {
  /** battery */
  battery: number;

  /** temperature(℃) 気温(℃)  */
  temperature: number;

  /** humidity(%) 湿度(%)  */
  humidity: number;
}

/** IBS_TH management class IBS_THを管理するクラス */
export default class IBS_TH implements ObnizPartsBleInterface {
  public _peripheral: BleRemotePeripheral | null = null;

  public static info(): ObnizPartsBleInfo {
    return {
      name: 'IBS_TH',
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return peripheral.localName === 'sps' || peripheral.localName === 'tst';
  }

  public static getData(peripheral: BleRemotePeripheral): IBS_TH_Data | null {
    if (!this.isDevice(peripheral)) {
      return null;
    }

    const allData = this._deviceAdvAnalyzer.getAllData(
      peripheral.manufacturerSpecificData!
    );

    const temperatureRaw = Buffer.from(
      allData.manufacture.temperature
    ).readInt16LE(0);
    const humidityRaw = Buffer.from(allData.manufacture.humidity).readInt16LE(
      0
    );
    const batteryRaw = Buffer.from(allData.manufacture.battery).readInt8(0);

    return {
      temperature: temperatureRaw / 100,
      humidity: humidityRaw / 100,
      battery: batteryRaw,
    };
  }

  private static _deviceAdvAnalyzer = new BleAdvBinaryAnalyzer()
    .groupStart('manufacture')
    .addTarget('temperature', [-1, -1])
    .addTarget('humidity', [-1, -1])
    .addTarget('probeTags', [-1])
    .addTarget('crc', [-1, -1])
    .addTarget('battery', [-1])
    .addTarget('testData', [-1])
    .groupEnd();
}
