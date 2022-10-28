/**
 * @packageDocumentation
 * @module Parts.TT_MSK1508
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface TT_MSK1508Options {
}
export interface TT_MSK1508Data {
    [k: string]: any;
}
/** TT-MSK1508 management class TT-MSK1508を管理するクラス */
export default class TT_MSK1508 implements ObnizPartsBleInterface {
    static OperatingMode: Record<number, string>;
    static FlowRateStatus: Record<number, string>;
    static BatteryStatus: Record<number, string>;
    static Model: Record<number, string>;
    static InfusionType: Record<number, string>;
    static Errors: Record<number, string>;
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the TT-MSK1508
     *
     * 受け取ったPeripheralがTT-MSK1508のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the TT-MSK1508
     *
     * TT-MSK1508かどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the TT-MSK1508
     *
     * TT-MSK1508からデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the TT-MSK1508 TT-MSK1508から受け取ったデータ
     *
     * ```
     * {
     *
     * temperature: temperature 温度 (Unit 単位: 0.1 degC)
     *
     * }
     * ```
     */
    static getData(peripheral: BleRemotePeripheral): TT_MSK1508Data | null;
    private static _deviceAdvAnalyzer;
    _peripheral: BleRemotePeripheral | null;
}
