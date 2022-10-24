/**
 * @packageDocumentation
 * @module Parts.TM511
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface TM511Options {
}
/**
 * advertisement data from TM511
 *
 * TM511からのadvertisementデータ
 */
export interface TM511_Data {
    /**
     * battery バッテリー
     */
    battery: number;
    /**
     * X-axis acceleration X軸加速度
     */
    x: number;
    /**
     * Y-axis acceleration Y軸加速度
     */
    y: number;
    /**
     * Z-axis acceleration Z軸加速度
     */
    z: number;
}
/** TM511 management class TM511を管理するクラス */
export default class TM511 implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the TM511
     *
     * 受け取ったPeripheralがTM511のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the TM511
     *
     * TM511かどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the TM511
     *
     * TM511からのデータ取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the TM511 TM511から受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): TM511_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
}
