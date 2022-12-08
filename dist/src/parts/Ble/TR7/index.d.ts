/**
 * @packageDocumentation
 * @module Parts.TR7
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface TR7Options {
}
export interface TR7Data {
    temperature: number;
    humidity: number;
}
/**
 * Class that manages TR7 series.
 *
 * TR7シリーズを管理するクラス。
 */
export default class TR7 implements ObnizPartsBleInterface {
    _peripheral: BleRemotePeripheral | null;
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the TR7.
     *
     * 受け取ったPeripheralがTR7シリーズのものかどうかを確認する。
     *
     * @param peripheral Instance of BleRemotePeripheral. BleRemotePeripheralのインスタンス。
     *
     * @returns Whether it is the TR7 or not. TR7かどうか。
     *
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get data from TR7 series.
     *
     * T7シリーズからデータを取得。
     *
     * @param peripheral Instance of BleRemotePeripheral. BleRemotePeripheralのインスタンス。
     *
     * @returns Data recieved from TR7. TR7から受け取ったデータ。
     *
     * ```
     * {
     *    temperature: temperature 温度 (Unit: 0.1 degC)
     *    humidity: humidity 湿度 (Unit: 0.1 %)
     * }
     * ```
     */
    static getData(peripheral: BleRemotePeripheral): TR7Data | null;
    private static _deviceAdvAnalyzer;
}
