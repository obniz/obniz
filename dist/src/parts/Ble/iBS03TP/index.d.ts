/**
 * @packageDocumentation
 * @module Parts.iBS03TP
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS03TPOptions {
}
/**
 * advertisement data from IBS03TP
 *
 * IBS03TPからのadvertisementデータ
 */
export interface IBS03TP_Data {
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
    /** temperature of the probe プローブの温度 (Unit 単位: 0.01 degC)*/
    probe_temperature: number;
}
/** iBS03TP management class iBS03TPを管理するクラス */
export default class IBS03TP implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the iBS03TP
     *
     * 受け取ったPeripheralがiBS03TPのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBS03TP
     *
     * iBS03TPかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the iBS03TP
     *
     * iBS03TPからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBS03TP iBS03TPから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): IBS03TP_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
}
