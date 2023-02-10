/**
 * @packageDocumentation
 * @module Parts.TR4
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

export interface Tr4Options {}

export interface Tr4_Data {
  temperature: number;
}

/** Tr4 series management class Tr4シリーズを管理するクラス */
export default class Tr4 implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'TR4',
    };
  }

  /**
   * Verify that the received peripheral is from the Tr4
   *
   * 受け取ったPeripheralがTr4のものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the Tr4
   *
   * Tr4かどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return Tr4._deviceAdvAnalyzer.validate(peripheral.adv_data);
  }

  /**
   * Get a data from the Tr4
   *
   * Tr4からデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the Tr4 Tr4から受け取ったデータ
   *
   * ```
   * {
   *
   * temperature: temperature 温度 (Unit 単位: 0.1 degC)
   *
   * }
   * ```
   */
  public static getData(peripheral: BleRemotePeripheral): Tr4_Data | null {
    if (!Tr4.isDevice(peripheral)) {
      return null;
    }
    const measureData = Tr4._deviceAdvAnalyzer.getData(
      peripheral.adv_data,
      'manufacture',
      'measureData'
    );
    if (!measureData) {
      return null;
    }

    if (measureData[0] === 0xee && measureData[1] === 0xee) {
      // sensor error
      return null;
    }
    const temperatureRaw = Buffer.from(measureData).readInt16LE(0);

    return {
      temperature: roundTo((temperatureRaw - 1000) / 10, 1),
    };
  }

  private static _deviceAdvAnalyzer = new BleAdvBinaryAnalyzer()
    .addTarget('flag', [0x02, 0x01, 0x06])

    .groupStart('manufacture')
    .addTarget('length', [0x1b])
    .addTarget('type', [0xff])
    .addTarget('companyId', [0x92, 0x03])
    .addTargetByLength('deviceSerial', 4)
    .addTarget('security', [-1])
    .addTarget('formatNo', [1])
    .addTarget('measureData', [-1, -1])
    .addTarget('reserved', [-1, -1])
    .addTarget('battery', [5])
    .addTargetByLength('reserved2', 13) // from datasheet length=14, but device send length=13
    .groupEnd()

    // local name adv is exist, but cannot use for filter
    .groupStart('localName')
    .groupEnd();

  public _peripheral: BleRemotePeripheral | null = null;
}
