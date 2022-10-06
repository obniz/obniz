/**
 * @packageDocumentation
 * @module Parts.TR4
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface Tr4Options {
}
export interface Tr4_Data {
    temperature: number;
}
/** Tr4 series management class Tr4シリーズを管理するクラス */
export default class Tr4 implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the Tr4
     *
     * 受け取ったPeripheralがTr4のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Tr4
     *
     * Tr4かどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the Tr4
     *
     * Tr4からデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Tr4 Tr4から受け取ったデータ
     *
     * ```
     * {
     *
     * temperature: temperature 温度 (Unit 単位: 0.1 degC)
     *
     * }
     * ```
     */
    static getData(peripheral: BleRemotePeripheral): Tr4_Data | null;
    private static _deviceAdvAnalyzer;
    _peripheral: BleRemotePeripheral | null;
}
