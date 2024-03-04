/**
 * @packageDocumentation
 * @module Parts.Switchbot_IOSensorTH
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import { Switchbot } from '../utils/abstracts/Switchbot';
export interface Switchbot_IOSensorTHOptions {
}
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
/** Switchbot_IOSensorTH management class Switchbot_WoIOSensorTHを管理するクラス */
export default class Switchbot_IOSensorTH extends Switchbot {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the Switchbot_IOSensorTH
     *
     * 受け取ったPeripheralがSwitchbot_IOSensorTHのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Switchbot_IOSensorTH
     *
     * Switchbot_IOSensorTHかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the Switchbot_IOSensorTH
     *
     * Switchbot_IOSensorTHからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Switchbot_IOSensorTH Switchbot_IOSensorTHから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): Switchbot_IOSensorTH_Data | null;
}
