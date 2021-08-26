/**
 * @packageDocumentation
 * @module Parts.iBS01H
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS01HOptions {
}
/**
 * advertisement data from IBS01H
 *
 * IBS01Hからのadvertisementデータ
 */
export interface IBS01H_Data {
    /** battery 電池電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /**
     * button state ボタンの状態
     *
     * true: pressed 押された状態 / false: not pressed 押されていない状態
     */
    button: boolean;
    /** magnet nearby or not 近くに磁石があるかどうか */
    hall_sensor: boolean;
}
/** iBS01H management class iBS01Hを管理するクラス */
export default class IBS01H implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the iBS01H
     *
     * 受け取ったPeripheralがiBS01Hのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBS01H
     *
     * iBS01Hかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the iBS01H
     *
     * iBS01Hからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBS01H iBS01Hから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): IBS01H_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
}
