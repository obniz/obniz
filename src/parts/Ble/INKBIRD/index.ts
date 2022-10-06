/**
 * @packageDocumentation
 * @module Parts.INKBIRD
 */
/* eslint rulesdir/non-ascii: 0 */

// import {BleRemotePeripheral, ObnizPartsBleInterface, ObnizPartsBleInfo} from 'obniz';

import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, {
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';
import { BleAdvBinaryAnalyzer } from '../utils/advertisement/advertismentAnalyzer';

export interface INKBIRDOptions {}

export interface INKBIRD_Data {
  temperature: number;
  humidity: number;
}

/** INKBIRD series management class INKBIRDシリーズを管理するクラス */
export default class INKBIRD implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'INKBIRD',
    };
  }

  /**
   * Verify that the received peripheral is from the INKBIRD
   *
   * 受け取ったPeripheralがINKBIRDのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the INKBIRD
   *
   * INKBIRDかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    // if (!peripheral.localName?.startsWith('sps')) {
    //   return false;
    // }
    // if (peripheral.localName?.startsWith('sps')) {
    //   console.log(peripheral);
    // }
    // console.log(INKBIRD._deviceAdvAnalyzer.validate(peripheral.adv_data));
    if (peripheral.adv_data && peripheral.scan_resp) {
      return INKBIRD._deviceAdvAnalyzer.validate([
        ...peripheral.adv_data,
        ...peripheral.scan_resp,
      ]);
    } else {
      return false;
    }
  }

  /**
   * Get a data from the INKBIRD
   *
   * INKBIRDからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the INKBIRD INKBIRDから受け取ったデータ
   *
   * ```
   * {
   *
   * temperature: temperature 温度 (Unit 単位: 0.1 degC)
   * humidity?: Humidity 湿度 (Unit 単位: 0.1 percent);
   * }
   * ```
   */
  public static getData(peripheral: BleRemotePeripheral): INKBIRD_Data | null {
    if (!INKBIRD.isDevice(peripheral)) {
      return null;
    }
    if (!peripheral.scan_resp) {
      return null;
    }

    const temperature = INKBIRD._deviceAdvAnalyzer.getData(
      [...peripheral.adv_data, ...peripheral.scan_resp],
      'manufacture',
      'temperature'
    );
    if (!temperature) {
      return null;
    }

    const temperatureRaw = Buffer.from(temperature).readInt16LE(0);

    const humidity = INKBIRD._deviceAdvAnalyzer.getData(
      [...peripheral.adv_data, ...peripheral.scan_resp],
      'manufacture',
      'humidity'
    );

    if (!humidity) {
      return null;
    }

    const humidityRaw = Buffer.from(humidity).readInt16LE(0);

    return {
      temperature: temperatureRaw / 100,
      humidity: humidityRaw / 100,
    };
  }

  private static _deviceAdvAnalyzer = new BleAdvBinaryAnalyzer()
    .addTarget('flag', [0x02, 0x01, 0x06])
    .groupStart('manufacture')
    .addTarget('length', [0x03])
    .addTarget('type', [0x02])
    .addTargetByLength('uuid', 2)
    .addTarget('length2', [0x04])
    .addTarget('type2', [0x09])
    .addTarget('deviceName', [0x73, 0x70, 0x73])
    .addTarget('dataLength', [0x0a])
    .addTarget('dataType', [0xff])
    .addTargetByLength('temperature', 2)
    .addTargetByLength('humidity', 2)
    .addTargetByLength('reserved', 5)
    .groupEnd();

  public _peripheral: BleRemotePeripheral | null = null;
}
