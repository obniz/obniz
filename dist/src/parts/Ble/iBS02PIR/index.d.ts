/**
 * @packageDocumentation
 * @module Parts.iBS02PIR
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS02PIROptions {
}
/**
 * advertisement data from IBS02PIR
 *
 * IBS02PIRからのadvertisementデータ
 */
export interface IBS02PIR_Data {
    /**
     * PIR (human detection) sensor responded or not
     *
     * PIR(人感)センサが反応したかどうか
     */
    event: boolean;
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
}
/** iBS02PIR management class iBS02PIRを管理するクラス */
export default class IBS02PIR implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the iBS02PIR
     *
     * 受け取ったPeripheralがiBS02PIRのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBS02PIR
     *
     * iBS02PIRかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the iBS02PIR
     *
     * iBS02PIRからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBS02PIR iBS02PIRから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): IBS02PIR_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
}
