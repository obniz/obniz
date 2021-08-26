/**
 * @packageDocumentation
 * @module Parts.iBS01G
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS01GOptions {
}
/**
 * advertisement data from IBS01G
 *
 * IBS01Gからのadvertisementデータ
 */
export interface IBS01G_Data {
    /** battery 電池電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /**
     * button state ボタンの状態
     *
     * true: pressed 押された状態 / false: not pressed 押されていない状態
     */
    button: boolean;
    /** moving or not 動いているかどうか */
    moving: boolean;
    /** fallen or not 落ちたかどうか */
    fall: boolean;
}
/** iBS01G management class iBS01Gを管理するクラス */
export default class IBS01G implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the iBS01G
     *
     * 受け取ったPeripheralがiBS01Gのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBS01G
     *
     * iBS01Gかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the iBS01G
     *
     * iBS01Gからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBS01G iBS01Gから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): IBS01G_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
}
