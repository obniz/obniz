/**
 * @packageDocumentation
 * @module Parts.RS_Seek3
 */
import Obniz from '../../../obniz';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface } from '../../../obniz/ObnizPartsBleInterface';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface RS_Seek3Options {
}
/** RS_Seek3 management class RS_Seek3を管理するクラス */
export default class RS_Seek3 implements ObnizPartsBleInterface {
    static info(): ObnizPartsInfo;
    /**
     * Verify that the received peripheral is from the RS_Seek3
     *
     * 受け取ったPeripheralがRS_Seek3のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the RS_Seek3
     *
     * RS_Seek3かどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    keys: string[];
    requiredKeys: string[];
    params: any;
    /**
     * Callback when the button is pressed
     *
     * ボタンが押されたときにコールバック
     */
    onpressed: (() => void) | null;
    _peripheral: BleRemotePeripheral | null;
    ondisconnect?: (reason: any) => void;
    private _uuids;
    private _buttonCharacteristic;
    private _tempHumidCharacteristic;
    constructor(peripheral: BleRemotePeripheral | null);
    wired(obniz: Obniz): void;
    /**
     * Connect the sensor
     *
     * センサへ接続
     */
    connectWait(): Promise<void>;
    /**
     * Disconnect from the sensor
     *
     * センサから切断
     */
    disconnectWait(): Promise<void>;
    /**
     * Get temperature and humidity data from the RS_SEEK3
     *
     * RS_SEEK3から温湿度データを取得
     *
     * @returns temperature and humidity data 温湿度データ
     *
     * ```
     * {
     *
     * temperature: temperature 温度,
     *
     * humidity: humidity 湿度
     *
     * }
     * ```
     */
    getTempHumidWait(): Promise<{
        temperature: number;
        humidity: number;
    }>;
}
