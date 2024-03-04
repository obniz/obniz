/**
 * @packageDocumentation
 * @module Parts.Switchbot_MotionSensor
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import { Switchbot } from '../utils/abstracts/Switchbot';
export interface Switchbot_MotionSensorOptions {
}
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
    static info(): ObnizPartsBleInfo;
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
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the Switchbot_MotionSensor
     *
     * Switchbot_MotionSensorからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Switchbot_MotionSensor Switchbot_MotionSensorから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): Switchbot_MotionSensor_Data | null;
}
