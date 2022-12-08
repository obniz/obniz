/**
 * @packageDocumentation
 * @module Parts.HEM-9200T
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface } from '../../../obniz/ObnizPartsBleInterface';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export declare type HEM_9200TMeasurementStatus = 'BodyMovementDetection' | 'CuffFitDetection' | 'IrregularPulseDetection' | 'PulseRateRangeDetection' | 'MeasurementPositionDetection';
/**
 * data from HEM_9200T
 *
 * HEM_9200Tからのデータ
 */
export interface HEM_9200TResult {
    /**
     * Blood pressure 血圧
     *
     * - Systolic pressure 最低血圧 (Range 範囲: 25-280)
     * - Diastolic pressure 最高血圧 (Range 範囲: 25-280)
     * - Mean arterial pressure 平均血圧 (Range 範囲: 25-280)
     */
    bloodPressure?: {
        systolic: number;
        diastolic: number;
        meanArterialPressure: number;
        unit: 'mmHg';
    };
    /** Time 時刻 */
    date?: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
    };
    /** Pulse rate value 脈拍値*/
    pulseRate?: number;
    /** User ID ユーザID */
    userId?: number;
    /**
     * Measurement status 測定状態
     *
     * [0] Body Movement Detection Flag 体動検知
     *
     * 0: Stable 静止 / 1: Moved 運動
     *
     *
     * [1] Cuff Fit Detection Flag 袖口へのフィット具合
     *
     * 0: Fit properly 適正 / 1: Too loose 緩い
     *
     *
     * [2] Irregular Pulse Detection Flag 不整脈検出
     *
     * 0: Normal 通常 / 1: Irregular 異常
     *
     *
     * [5] Measurement Position Detection Flag 測定位置検出
     *
     * 0: Proper 適正 / 1: Improper 適正でない
     */
    measurementStatus?: HEM_9200TMeasurementStatus[];
}
export interface HEM_9200TOptions {
    /**
     * difference from UTC (Unit: minutes) 協定世界時との差(単位: 分)
     */
    timezoneOffsetMinute?: number;
    /**
     * Pin code that's written on the back of the device. If leading '0's are included, omit them. 043933 -> 43933
     * デバイスの背面に書かれているピンコード。先頭の'0'は省く。043933 -> 43933
     */
    passkey?: number;
}
/** HEM_9200T management class HEM_9200Tを管理するクラス */
export default class HEM_9200T implements ObnizPartsBleInterface {
    static info(): ObnizPartsInfo;
    /**
     * Verify that the received peripheral is from the HEM_9200T
     *
     * 受け取ったPeripheralがHEM_9200Tのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the HEM_9200T
     *
     * HEM_9200Tかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    keys: string[];
    requiredKeys: string[];
    params: any;
    _peripheral: BleRemotePeripheral | null;
    private _timezoneOffsetMinute;
    private _passkey;
    constructor(peripheral: BleRemotePeripheral | null, options?: HEM_9200TOptions);
    /**
     * Connect to the device, get data, and then disconnect from the device
     *
     * You can get only data that the device has not yet sent
     *
     * デバイスに接続しデータを取得後、デバイスとの接続を切断
     *
     * 取得できるデータはデバイスが未送信のデータのみです
     *
     * @returns received data from the HEM_9200T HEM_9200Tから受け取ったデータ
     */
    getDataWait(): Promise<HEM_9200TResult[]>;
    /**
     * Execute a callback function when data is received from any service characteristic
     *
     * 任意のサービス・キャラクタティスティックからデータを受け取ると、コールバック関数を実行
     *
     * @param service service サービス
     *
     * @param char characteristic キャラクタリスティック
     *
     * @param callback callback function when received data
     * データを受け取ったときのコールバック関数
     */
    subscribeWait(service: string, char: string, callback?: any): Promise<void>;
    private _analyzeData;
    private _readSFloat;
}
