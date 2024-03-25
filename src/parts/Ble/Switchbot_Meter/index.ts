/**
 * @packageDocumentation
 * @module Parts.Switchbot_Meter
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
import Switchbot_Bot from '../Switchbot_Bot';
import { Switchbot } from '../utils/abstracts/Switchbot';

export interface Switchbot_MeterOptions {}

/**
 * advertisement data from Switchbot_Meter
 *
 * Switchbot_Meterからのadvertisementデータ
 */
export interface Switchbot_Meter_Data {
  temperature: number;
  humidity: number;
  battery: number;
}

/** Switchbot_Meter management class Switchbot_Meterを管理するクラス */
export default class Switchbot_Meter extends Switchbot {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'Switchbot_Meter',
    };
  }

  /**
   * Verify that the received peripheral is from the Switchbot_Meter
   *
   * 受け取ったPeripheralがSwitchbot_Meterのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the Switchbot_Meter
   *
   * Switchbot_Meterかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return Switchbot.isSwitchbotDevice(peripheral, 0x54, 5);
  }

  /**
   * Get a data from the Switchbot_Meter
   *
   * Switchbot_Meterらデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the Switchbot_Meter Switchbot_Meterから受け取ったデータ
   */
  public static getData(
    peripheral: BleRemotePeripheral
  ): Switchbot_Meter_Data | null {
    if (!Switchbot_Meter.isDevice(peripheral)) {
      return null;
    }
    const serviceData = Switchbot.getServiceDataPayload(peripheral, 0x54, 5);

    if (!serviceData) return null; // not target device

    const buf = Buffer.from(serviceData);
    const byte2 = buf.readUInt8(1);
    const byte3 = buf.readUInt8(2);
    const byte4 = buf.readUInt8(3);
    const byte5 = buf.readUInt8(4);

    const temp_sign = byte4 & 0b10000000 ? 1 : -1;
    const temp_c =
      temp_sign * ((byte4 & 0b01111111) + (byte3 & 0b00001111) / 10);

    const data = {
      temperature: temp_c,
      humidity: byte5 & 0b01111111,
      battery: byte2 & 0b01111111,
    };
    return data;
  }
}
