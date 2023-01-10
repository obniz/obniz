/**
 * @packageDocumentation
 * @module Parts.UT201BLE
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import { BleBatteryService } from '../utils/services/batteryService';
import { BleGenericAccess } from '../utils/services/genericAccess';
export interface UT201BLEOptions {
}
/**
 * body temperature data from UT201BLE
 *
 * (body temperature will be returned in either Fahrenheit or Celsius format)
 *
 * UT201BLEからの体温データ
 *
 * (体温はFahrenheit形式かCelsius形式のどちらかが返ってきます)
 */
export interface UT201BLEResult {
    /**
     * body temperature in Fahrenheit format Fahrenheit形式の体温
     *
     * (Unit 単位: 0.1 degF)
     */
    fahrenheit?: number;
    /**
     * body temperature in Celsius format Celsius形式の体温
     *
     * Range 範囲: 32.00~42.00 (Unit 単位: 0.01 degC)
     */
    celsius?: number;
    /** timestamp タイムスタンプ */
    date?: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
    };
    /**
     * part where body temperature was measured 体温の計測部位
     *
     * Value 値: 'unknown' | 'Armpit' | 'Body' | 'Ear' | 'Finger' | 'Gastro-intestinal Tract' | 'Mouth' | 'Rectum' | 'Toe' | 'Tympanum'
     */
    temperatureType?: string;
    /**
     * battery(%) バッテリー(%)
     *
     * Value 値: 100 | 66 | 40 | 33
     */
    battery?: number;
}
/** UT201BLE management class UT201BLEを管理するクラス */
export default class UT201BLE implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the UT201BLE
     *
     * 受け取ったPeripheralがUT201BLEのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is UT201BLE
     *
     * UT201BLEかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean | "" | null;
    onNotify?: (co2: number) => void;
    _peripheral: BleRemotePeripheral | null;
    ondisconnect?: (reason: any) => void;
    genericAccess?: BleGenericAccess;
    batteryService?: BleBatteryService;
    private _timezoneOffsetMinute;
    constructor(peripheral: BleRemotePeripheral | null, timezoneOffsetMinute: number);
    isPairingMode(): boolean;
    /**
     * Pair with the device
     *
     * デバイスとペアリング
     *
     * @returns pairing key ペアリングキー
     */
    pairingWait(): Promise<string | null>;
    /**
     * Get data from the UT201BLE
     *
     * UT201BLEからデータを取得
     *
     * @param pairingKeys pairing key ペアリングキー
     *
     * @returns data from the UT201BLE UT201BLEから受け取ったデータ
     */
    getDataWait(pairingKeys?: string): Promise<UT201BLEResult[]>;
    private _readFloatLE;
    private _analyzeData;
    private _getChars;
    private _writeTimeCharWait;
}
