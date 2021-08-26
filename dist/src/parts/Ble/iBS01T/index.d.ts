/**
 * @packageDocumentation
 * @module Parts.iBS01T
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS01TOptions {
}
/**
 * advertisement data from IBS01T
 *
 * IBS01Tからのadvertisementデータ
 */
export interface IBS01T_Data {
    /**
     * button state ボタンの状態
     *
     * true: pressed 押された状態 / false: not pressed 押されていない状態
     */
    button: boolean;
    /** moving or not 動いているかどうか */
    moving: boolean;
    /** reed bit is true or false reedビットが真かどうか */
    reed: boolean;
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /** temperature 温度 (Unit 単位: 0.01 degC)*/
    temperature: number;
    /** humidity 相対湿度 (Unit 単位: 1% RH) */
    humidity: number;
}
/** iBS01T management class iBS01Tを管理するクラス */
export default class IBS01T implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the iBS01T
     *
     * 受け取ったPeripheralがiBS01Tのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @param strictCheck Whether do strict check
     *
     * strictCheckをするかどうか
     *
     * @returns Whether it is the iBS01T
     *
     * iBS01Tかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral, strictCheck?: boolean): boolean;
    /**
     * Get a data from the iBS01T
     *
     * iBS01Tからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @param strictCheck Whether do strict check strictCheckをするかどうか
     *
     * @returns received data from the iBS01T iBS01Tから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral, strictCheck?: boolean): IBS01T_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
}
