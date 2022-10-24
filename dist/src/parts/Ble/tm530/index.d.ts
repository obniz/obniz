/**
 * @packageDocumentation
 * @module Parts.TM530
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface TM530Options {
}
/**
 * advertisement data from TM530
 *
 * TM530からのadvertisementデータ
 */
export interface TM530_Data {
    /**
     * battery バッテリー
     */
    battery: number;
    /**
     * temperature 温度
     */
    temperature: number;
    /**
     * humidity 湿度
     */
    humidity: number;
}
/** TM530 management class TM530を管理するクラス */
export default class TM530 implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the TM530
     *
     * 受け取ったPeripheralがTM530のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the TM530
     *
     * TM530かどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the TM530
     *
     * TM530からデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the TM530 TM530から受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): TM530_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
}
