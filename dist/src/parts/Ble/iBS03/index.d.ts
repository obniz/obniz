/**
 * @packageDocumentation
 * @module Parts.iBS03
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS03Options {
}
/**
 * advertisement data from IBS03
 *
 * IBS03からのadvertisementデータ
 */
export interface IBS03_Data {
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
}
/** iBS03 management class iBS03を管理するクラス */
export default class IBS03 implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the iBS03
     *
     * 受け取ったPeripheralがiBS03のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBS03
     *
     * iBS03かどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the iBS03
     *
     * iBS03からデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBS03 iBS03から受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): IBS03_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
}
