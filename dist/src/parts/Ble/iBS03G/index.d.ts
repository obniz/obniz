/**
 * @packageDocumentation
 * @module Parts.iBS03G
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS03GOptions {
}
/**
 * advertisement data from IBS03G
 *
 * IBS03Gからのadvertisementデータ
 */
export interface IBS03G_Data {
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
/** iBS03G management class iBS03Gを管理するクラス */
export default class IBS03G implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the iBS03G
     *
     * 受け取ったPeripheralがiBS03Gのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBS03G
     *
     * iBS03Gかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the iBS03G
     *
     * iBS03Gからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBS03G iBS03Gから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): IBS03G_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
}
