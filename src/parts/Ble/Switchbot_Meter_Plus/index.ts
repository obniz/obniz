/**
 * @packageDocumentation
 * @module Parts.Switchbot_Meter_Plus
 */
/* eslint rulesdir/non-ascii: 0 */

import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import { Switchbot } from '../utils/abstracts/Switchbot';

export interface Switchbot_Meter_PlusOptions {}

/**
 * advertisement data from Switchbot_Meter_Plus
 *
 * Switchbot_Meter_PLusからのadvertisementデータ
 */
export interface Switchbot_Meter_Plus_Data {
  temperature: number;
  humidity: number;
  battery: number;
}

/** Switchbot_WoSensor management class Switchbot_WoSensorHTを管理するクラス */
export default class Switchbot_Meter_Plus extends Switchbot {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'Switchbot_Meter_Plus',
    };
  }

  /**
   * Verify that the received peripheral is from the Switchbot_WoSensor
   *
   * 受け取ったPeripheralがSwitchbot_WoSensorHTのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the Switchbot_WoSensorHT
   *
   * Switchbot_WoSensorHTかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return Switchbot.isSwitchbotDevice(peripheral, 0x69, 5);
  }

  /**
   * Get a data from the Switchbot_WoSensor
   *
   * Switchbot_Meter_Plusからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the Switchbot_WoSensorHT Switchbot_WoSensorHTから受け取ったデータ
   */
  public static getData(
    peripheral: BleRemotePeripheral
  ): Switchbot_Meter_Plus_Data | null {
    if (!Switchbot_Meter_Plus.isDevice(peripheral)) {
      return null;
    }
    const serviceData = Switchbot.getServiceDataPayload(peripheral, 0x69, 5);

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
