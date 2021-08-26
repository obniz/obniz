/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS02IROptions {
}
/**
 * advertisement data from IBS02IR
 *
 * IBS02IRからのadvertisementデータ
 */
export interface IBS02IR_Data {
    /** IR proximity sensor responded or not 赤外線近接センサが反応したかどうか */
    event: boolean;
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
}
/** iBS02IR management class iBS02IRを管理するクラス */
export default class IBS02IR implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the iBS02IR
     *
     * 受け取ったPeripheralがiBS02IRのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBS02IR
     *
     * iBS02IRかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the iBS02IR
     *
     * iBS02IRからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBS02IR iBS02IRから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): IBS02IR_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
}
