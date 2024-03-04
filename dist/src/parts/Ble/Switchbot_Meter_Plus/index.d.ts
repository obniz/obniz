/**
 * @packageDocumentation
 * @module Parts.Switchbot_Meter_Plus
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import { Switchbot } from '../utils/abstracts/Switchbot';
export interface Switchbot_Meter_PlusOptions {
}
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
/** Switchbot_Meter_PLus management class Switchbot_Meter_PLusを管理するクラス */
export default class Switchbot_Meter_Plus extends Switchbot {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the Switchbot_Meter_PLus
     *
     * 受け取ったPeripheralがSwitchbot_Meter_PLusのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Switchbot_Meter_PLus
     *
     * Switchbot_Meter_PLusかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the Switchbot_Meter_PLus
     *
     * Switchbot_Meter_Plusからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Switchbot_Meter_PLus Switchbot_Meter_PLusから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): Switchbot_Meter_Plus_Data | null;
}
