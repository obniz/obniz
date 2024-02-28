/**
 * @packageDocumentation
 * @module Parts.Switchbot_Meter
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import { Switchbot } from '../utils/abstracts/Switchbot';
export interface Switchbot_MeterOptions {
}
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
/** Switchbot_WoSensor management class Switchbot_WoSensorHTを管理するクラス */
export default class Switchbot_Meter extends Switchbot {
    static info(): ObnizPartsBleInfo;
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
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the Switchbot_WoSensor
     *
     * Switchbot_Meterらデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Switchbot_WoSensorHT Switchbot_WoSensorHTから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): Switchbot_Meter_Data | null;
}
