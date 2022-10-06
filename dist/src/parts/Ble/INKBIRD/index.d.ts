/**
 * @packageDocumentation
 * @module Parts.INKBIRD
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface INKBIRDOptions {
}
export interface INKBIRD_Data {
    temperature: number;
    humidity: number;
}
/** INKBIRD series management class INKBIRDシリーズを管理するクラス */
export default class INKBIRD implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the INKBIRD
     *
     * 受け取ったPeripheralがINKBIRDのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the INKBIRD
     *
     * INKBIRDかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the INKBIRD
     *
     * INKBIRDからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the INKBIRD INKBIRDから受け取ったデータ
     *
     * ```
     * {
     *
     * temperature: temperature 温度 (Unit 単位: 0.1 degC)
     * humidity?: Humidity 湿度 (Unit 単位: 0.1 percent);
     * }
     * ```
     */
    static getData(peripheral: BleRemotePeripheral): INKBIRD_Data | null;
    private static _deviceAdvAnalyzer;
    _peripheral: BleRemotePeripheral | null;
}
