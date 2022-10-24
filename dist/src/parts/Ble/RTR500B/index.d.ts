/**
 * @packageDocumentation
 * @module Parts.RTR500B
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface RTR500BOptions {
}
export interface RTR500B_Data {
    temperature: number;
    humidity?: number;
}
/** Tr4 series management class RTR500Bシリーズを管理するクラス */
export default class RTR500B implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the RTR500B
     *
     * 受け取ったPeripheralがRTR500Bのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the RTR500B
     *
     * RTR500Bかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the RTR500B
     *
     * Tr4からデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the RTR500B RTR500Bから受け取ったデータ
     *
     * ```
     * {
     *
     * temperature: temperature 温度 (Unit 単位: 0.1 degC)
     * humidity?: Humidity 湿度 (Unit 単位: 0.1 percent);
     * }
     * ```
     */
    static getData(peripheral: BleRemotePeripheral): RTR500B_Data | null;
    private static _deviceAdvAnalyzer;
    _peripheral: BleRemotePeripheral | null;
}
