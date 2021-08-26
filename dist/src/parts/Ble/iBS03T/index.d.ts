/**
 * @packageDocumentation
 * @module Parts.iBS03T
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS03TOptions {
}
/**
 * advertisement data from IBS03T
 *
 * IBS03Tからのadvertisementデータ
 */
export interface IBS03T_Data {
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /**
     * button state ボタンの状態
     *
     * true: pressed 押された状態 / false: not pressed 押されていない状態
     */
    button: boolean;
    /** moving or not 動いているかどうか */
    moving: boolean;
    /** magnet nearby or not 近くに磁石があるかどうか */
    hall_sensor: boolean;
    /** temperature 温度 (Unit 単位: 0.01 degC)*/
    temperature: number;
}
/** iBS03T management class iBS03Tを管理するクラス */
export default class IBS03T implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the iBS03T
     *
     * 受け取ったPeripheralがiBS03Tのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     * @returns Whether it is the iBS03T
     *
     * iBS03Tかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the iBS03T
     *
     * iBS03Tからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBS03T iBS03Tから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): IBS03T_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
}
