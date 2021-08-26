/**
 * @packageDocumentation
 * @module Parts.iBS01
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS01Options {
}
/**
 * advertisement data from IBS01
 *
 * IBS01からのadvertisementデータ
 */
export interface IBS01_Data {
    /** battery 電池電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /**
     * button state ボタンの状態
     *
     * true: pressed 押された状態 / false: not pressed 押されていない状態
     */
    button: boolean;
    /**
     * @deprecated use iBS01H library
     */
    moving: boolean;
    /**
     * @deprecated use iBS01H or iBS01G library
     */
    hall_sensor: boolean;
    /**
     * @deprecated use iBS01G library
     */
    fall: boolean;
}
/** iBS01 management class iBS01を管理するクラス */
export default class IBS01 implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the iBS01
     *
     * 受け取ったPeripheralがiBS01のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @param strictCheck Whether do strict check
     *
     * strictCheckをするかどうか
     *
     * @returns Whether it is the iBS01
     *
     * iBS01かどうか
     */
    static isDevice(peripheral: BleRemotePeripheral, strictCheck?: boolean): boolean;
    /**
     * Get a data from the iBS01
     *
     * iBS01からデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @param strictCheck Whether do strict check
     *
     * strictCheckをするかどうか
     *
     * @returns received data from the iBS01 iBS01から受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral, strictCheck?: boolean): IBS01_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
}
