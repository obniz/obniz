/**
 * @packageDocumentation
 * @module Parts.iBS04
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS04Options {
}
/**
 * advertisement data from IBS04
 *
 * IBS04からのadvertisementデータ
 */
export interface IBS04_Data {
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /**
     * button state ボタンの状態
     *
     * true: pressed 押された状態 / false: not pressed 押されていない状態
     */
    button: boolean;
}
/** iBS04 management class iBS04を管理するクラス */
export default class IBS04 implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the iBS04
     *
     * 受け取ったPeripheralがiBS04のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBS04
     *
     * iBS04かどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the iBS04
     *
     * iBS04からデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBS04 iBS04から受け取ったデータ
     *
     */
    static getData(peripheral: BleRemotePeripheral): IBS04_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
}
