/**
 * @packageDocumentation
 * @module Parts.Switchbot_ContactSensor
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import { Switchbot } from '../utils/abstracts/Switchbot';
export interface Switchbot_ContactSensorOptions {
}
/**
 * advertisement data from Switchbot_ContactSensor
 *
 * Switchbot_ContactSensorからのadvertisementデータ
 */
export interface Switchbot_ContactSensor_Data {
    scopeTested: boolean;
    someoneIsMoving: boolean;
    battery: number;
    pir: number;
    hal: number;
    halState: 'close' | 'open' | 'timeoutNotClose';
    lightLevel: 'light' | 'dark';
    numberOfEntrances: number;
    numberOfGoOutCounter: number;
    buttonPushCounter: number;
}
/** Switchbot_ContactSensor management class Switchbot_ContactSensorを管理するクラス */
export default class Switchbot_ContactSensor extends Switchbot {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the Switchbot_ContactSensor
     *
     * 受け取ったPeripheralがSwitchbot_ContactSensorのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Switchbot_ContactSensor
     *
     * Switchbot_ContactSensorかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the Switchbot_ContactSensor
     *
     * Switchbot_ContactSensorからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Switchbot_ContactSensor Switchbot_ContactSensorから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): Switchbot_ContactSensor_Data | null;
}
