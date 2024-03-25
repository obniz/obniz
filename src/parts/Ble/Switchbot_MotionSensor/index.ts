/**
 * @packageDocumentation
 * @module Parts.Switchbot_MotionSensor
 */
/* eslint rulesdir/non-ascii: 0 */

import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import { Switchbot } from '../utils/abstracts/Switchbot';

export interface Switchbot_MotionSensorOptions {}

/**
 * advertisement data from Switchbot_MotionSensor
 *
 * Switchbot_MotionSensorからのadvertisementデータ
 */
export interface Switchbot_MotionSensor_Data {
  battery: number;
  scopeTested: boolean;
  someoneIsMoving: boolean;
  pirUtc: number;
  ledState: 'enable' | 'disable';
  iotState: 'enable' | 'disable';
  sensingDistance: 'long' | 'middle' | 'short';
  lightIntensity: 'dark' | 'bright';
}

/** Switchbot_MotionSensor management class Switchbot_MotionSensorを管理するクラス */
export default class Switchbot_MotionSensor extends Switchbot {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'Switchbot_MotionSensor',
    };
  }

  /**
   * Verify that the received peripheral is from the Switchbot_MotionSensor
   *
   * 受け取ったPeripheralがSwitchbot_MotionSensorのものかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Whether it is the Switchbot_MotionSensor
   *
   * Switchbot_MotionSensorかどうか
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    return Switchbot.isSwitchbotDevice(
      peripheral,
      [0x53, 0x73], // Motion Sensor: 0x53(Pair Mode) or 0x73(Const Adv Mode)
      5
    );
  }

  /**
   * Get a data from the Switchbot_MotionSensor
   *
   * Switchbot_MotionSensorからデータを取得
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns received data from the Switchbot_MotionSensor Switchbot_MotionSensorから受け取ったデータ
   */
  public static getData(
    peripheral: BleRemotePeripheral
  ): Switchbot_MotionSensor_Data | null {
    if (!Switchbot_MotionSensor.isDevice(peripheral)) {
      return null;
    }
    const serviceData = Switchbot.getServiceDataPayload(
      peripheral,
      [0x53, 0x73], // Motion Sensor: 0x53(Pair Mode) or 0x73(Const Adv Mode)
      5
    );

    if (!serviceData) return null; // not target device

    const buf = Buffer.from(serviceData);
    const byte1 = buf.readUInt8(0);
    const byte2 = buf.readUInt8(1);
    const lowPIR = buf.readUInt16BE(2);
    const byte5 = buf.readUInt8(4);

    const scopeTested = byte1 & 0b10000000 ? true : false;
    const pirState = byte1 & 0b01000000 ? true : false;
    const battery = byte2 & 0b01111111;

    const pirUtc = ((byte5 & 0x10000000) >> 7) * 65536 + lowPIR;
    const ledState = byte5 & 0b00100000 ? 'enable' : 'disable';
    const iotState = byte5 & 0b00010000 ? 'enable' : 'disable';
    const sensingDistanceBit = (byte5 & 0b00001100) >> 2;
    const sensingDistance =
      sensingDistanceBit === 0b00
        ? 'long'
        : sensingDistanceBit === 0b01
        ? 'middle'
        : sensingDistanceBit === 0b10
        ? 'short'
        : null;
    if (sensingDistance === null) return null; // unknown distance
    const lightIntensityBit = byte5 & 0b00000011;
    const lightIntensity =
      lightIntensityBit === 0b01
        ? 'dark'
        : lightIntensityBit === 0b10
        ? 'bright'
        : null;
    if (lightIntensity === null) return null; // unknown intensity

    const data: Switchbot_MotionSensor_Data = {
      battery,
      scopeTested,
      someoneIsMoving: pirState,
      pirUtc,
      ledState,
      iotState,
      sensingDistance,
      lightIntensity,
    };
    return data;
  }
}
