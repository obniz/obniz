/**
 * @packageDocumentation
 * @module Parts.MiniBreeze
 */
import Obniz from '../../../obniz';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface } from '../../../obniz/ObnizPartsBleInterface';
/**
 * advertisement data from MiniBreeze
 *
 * MiniBreezeからのadvertisementデータ
 */
export interface MiniBreeze_InfoData {
    /** gas type ガスタイプ */
    gasType: 'none' | 'HCHO' | 'CO' | 'CO2' | 'Rn' | 'PM1.0' | 'PM2.5' | 'PM10' | 'unknown';
    /**
     * gas sensor value ガスセンサの値
     * (Unit 単位: ppm or ug/m3)
     */
    sensVal: number;
    /**
     * temperature 温度
     *
     * Range 範囲: -99~99 (Unit 単位: 1 degC)
     */
    temperature: number;
    /**
     * relative humidity 湿度
     *
     * Range 範囲: 0~100 (Unit 単位: 1%RH)
     */
    humidity: number;
    /** Firmware version ファームウェアのバージョン */
    version: string;
    /**
     * battery status バッテリーの状態
     */
    status: 'BatteryEmpty' | 'BatteryLow' | 'BatteryNormal' | 'BatteryCharging' | 'Invalid';
    /** device name デバイスの名前 */
    devName: string;
}
export interface MiniBreezeOptions {
}
/** MiniBreeze management class MiniBreezeを管理するクラス */
export default class MiniBreeze implements ObnizPartsBleInterface {
    static info(): {
        name: string;
    };
    /**
     * @returns object of gas types list ガスタイプの一覧のオブジェクト
     */
    static gasType(): any;
    /**
     * @returns object of battery status list バッテリーの状態の一覧のオブジェクト
     */
    static status(): any;
    /**
     * Verify that the received peripheral is from the MiniBreeze
     *
     * 受け取ったPeripheralがMiniBreezeのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the MiniBreeze
     *
     * MiniBreezeかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the MiniBreeze
     *
     * MiniBreezeからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the MiniBreeze
     *
     * MiniBreezeから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): null | MiniBreeze_InfoData;
    private static _hasPrefix;
    _peripheral: null | BleRemotePeripheral;
    keys: string[];
    requiredKeys: string[];
    params: any;
    wired(obniz: Obniz): void;
}
