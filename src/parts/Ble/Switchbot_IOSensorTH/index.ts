/**
 * @packageDocumentation
 * @module Parts.Switchbot_IOSensorTH
 */
/* eslint rulesdir/non-ascii: 0 */

import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import { Switchbot } from '../utils/abstracts/Switchbot';

export interface Switchbot_IOSensorTHOptions {}

/**
 * advertisement data from Switchbot_IOSensorTH
 *
 * Switchbot_IOSensorTHからのadvertisementデータ
 */
export interface Switchbot_IOSensorTH_Data {
  temperature: number;
  fahrenheit: boolean;
  humidity: number;
  battery: number;
}

/** Switchbot_WoSensor management class Switchbot_WoIOSensorTHを管理するクラス */
export default class Switchbot_IOSensorTH extends Switchbot {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'Switchbot_IOSensorTH',
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
    return Switchbot.isSwitchbotDevice(peripheral, 0x77, 2);
  }

  /**
   * Get a data from the Switchbot_WoSensor
   *
   * Switchbot_IOSensorTHからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the Switchbot_WoSensorHT Switchbot_WoSensorHTから受け取ったデータ
   */
  public static getData(
    peripheral: BleRemotePeripheral
  ): Switchbot_IOSensorTH_Data | null {
    if (!Switchbot_IOSensorTH.isDevice(peripheral)) {
      return null;
    }
    const serviceData = Switchbot.getServiceDataPayload(peripheral, 0x77, 2);

    if (!serviceData) return null; // not target device
    if (peripheral.manufacturerSpecificData?.length !== 14) return null; // not target device

    const manufacturerDataBuf = Buffer.from(
      peripheral.manufacturerSpecificData
    );
    const mdByte10 = manufacturerDataBuf.readUInt8(10);
    const mdByte11 = manufacturerDataBuf.readUInt8(11);
    const mdByte12 = manufacturerDataBuf.readUInt8(12);

    const sdByte2 = Buffer.from(serviceData).readUInt8(1);

    const temp_sign = mdByte11 & 0b10000000 ? 1 : -1;
    const temp_c =
      temp_sign * ((mdByte11 & 0b01111111) + (mdByte10 & 0b00001111) / 10);

    const data = {
      temperature: temp_c,
      fahrenheit: mdByte12 & 0b10000000 ? true : false,
      humidity: mdByte12 & 0b01111111,
      battery: sdByte2 & 0b01111111,
    };
    return data;
  }
}
