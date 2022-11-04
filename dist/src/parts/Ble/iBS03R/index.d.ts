/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS03ROptions {
}
/**
 * advertisement data from iBS03R
 *
 * iBS03Rからのadvertisementデータ
 */
export interface IBS03R_Data {
    /** battery 電池電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /**
     * button state ボタンの状態
     *
     * true: pressed 押された状態 / false: not pressed 押されていない状態
     */
    button: boolean;
    /** distance 距離 (Unit 単位: 1 mm) */
    distance: number;
    /** MAC address MACアドレス */
    address: string;
}
/** iBS03R management class iBS03Rを管理するクラス */
export default class IBS03R implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the iBS03R
     *
     * 受け取ったPeripheralがiBS03Rのものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBS03R
     *
     * iBS03Rかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the iBS03R
     *
     * iBS03Rからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBS03R iBS03Rから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): IBS03R_Data | null;
    private static deviceAdv;
    private static getDeviceArray;
    _peripheral: BleRemotePeripheral | null;
}
