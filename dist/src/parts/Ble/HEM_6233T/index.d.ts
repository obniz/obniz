/**
 * @packageDocumentation
 * @module Parts.HEM_6233T
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface } from '../../../obniz/ObnizPartsBleInterface';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface HEM_6233TOptions {
}
export declare type HEM_6233TMeasurementStatus = 'BodyMovementDetection' | 'CuffFitDetection' | 'IrregularPulseDetection' | 'PulseRateRangeDetection' | 'MeasurementPositionDetection';
/**
 * data from HEM_6233T
 *
 * HEM_6233Tからのデータ
 */
export interface HEM_6233TResult {
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
    measurementStatus?: HEM_6233TMeasurementStatus[];
}
/** HEM_6233T management class HEM_6233Tを管理するクラス */
export default class HEM_6233T implements ObnizPartsBleInterface {
    static info(): ObnizPartsInfo;
    /**
     * Verify that the received peripheral is from the HEM_6233T
     *
     * 受け取ったPeripheralがHEM_6233Tのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the HEM_6233T
     *
     * HEM_6233Tかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    keys: string[];
    requiredKeys: string[];
    params: any;
    _peripheral: BleRemotePeripheral | null;
    private _timezoneOffsetMinute;
    /**
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @param timezoneOffsetMinute difference from UTC (Unit: minutes) 協定世界時との差(単位: 分)
     *
     */
    constructor(peripheral: BleRemotePeripheral | null, timezoneOffsetMinute: number);
    /**
     * Connect to the device, get data, and then disconnect from the device
     *
     * You can get only data that the device has not yet sent
     *
     * デバイスに接続しデータを取得後、デバイスとの接続を切断
     *
     * 取得できるデータはデバイスが未送信のデータのみです
     *
     * @param pairingKeys pairing keys ペアリングキー
     *
     * @returns received data from the HEM_6233T HEM_6233Tから受け取ったデータ
     */
    getDataWait(pairingKeys?: string): Promise<HEM_6233TResult[]>;
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
    /**
     * Set the current time
     *
     * 現在時刻を設定
     *
     * @param timeOffsetMinute difference from UTC (Unit: minutes) 協定世界時との差(単位: 分)
     */
    _writeTimeCharWait(timeOffsetMinute: number): Promise<void>;
    private _readFloatLE;
    private _readSFloatLE;
    private _analyzeData;
}
