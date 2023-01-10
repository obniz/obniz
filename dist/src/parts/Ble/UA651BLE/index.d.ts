/**
 * @packageDocumentation
 * @module Parts.UA651BLE
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import { BleBatteryService } from '../utils/services/batteryService';
import { BleGenericAccess } from '../utils/services/genericAccess';
export interface UA651BLEOptions {
}
/**
 * blood pressure data from UA651BLE
 *
 * (blood pressure will return either mmHg or kPa unit)
 *
 * UA651BLEからの血圧データ
 *
 * (血圧はmmHg形式化かkPa形式のどちらかが返ってきます)
 */
export interface UA651BLEResult {
    /**
     * systolic pressure 最高血圧
     *
     * Range 範囲: 0~299 (Unit 単位: 1 mmHg)
     */
    SystolicPressure_mmHg?: number;
    /**
     * diastolic pressure 最低血圧
     *
     * Range 範囲: 0~299 (Unit 単位: 1 mmHg)
     */
    DiastolicPressure_mmHg?: number;
    /**
     * mean arterial pressure 平均血圧
     *
     * Range 範囲: 0~299 (Unit 単位: 1 mmHg)
     */
    MeanArterialPressure_mmHg?: number;
    /** systolic pressure 最高血圧 (Unit 単位: 0.1 kPa) */
    SystolicPressure_kPa?: number;
    /** diastolic pressure 最低血圧 (Unit 単位: 0.1 kPa) */
    DiastolicPressure_kPa?: number;
    /** mean arterial pressure 平均血圧 (Unit 単位: 0.1 kPa) */
    MeanArterialPressure_kPa?: number;
    /** body moved or not 体が動いたかどうか */
    bodyMoved?: boolean;
    /** cuff is loose or not カフが緩いかどうか */
    cuffFitLoose?: boolean;
    /** irregular pulse detected or not 不整脈が検出されたかどうか */
    irregularPulseDetected?: boolean;
    /** measurement position is improper or not 測定位置が不適切であるか */
    improperMeasurement?: boolean;
    /**
     * pulse rate 脈拍数
     *
     * Range 範囲: 40~180 (Unit 単位: 1 bpm)
     */
    PulseRate?: number;
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
     * battery(%) バッテリー(%)
     *
     * Value 値: 100 | 66 | 40 | 33
     */
    battery?: number;
}
/** UA651BLE management class UA651BLEを管理するクラス */
export default class UA651BLE implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the UA651BLE
     *
     * 受け取ったPeripheralがUA651BLEのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is UA651BLE
     *
     * UA651BLEかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean | "" | null;
    onNotify?: (co2: number) => void;
    _peripheral: BleRemotePeripheral;
    ondisconnect?: (reason: any) => void;
    genericAccess?: BleGenericAccess;
    batteryService?: BleBatteryService;
    private _timezoneOffsetMinute;
    constructor(peripheral: BleRemotePeripheral, timezoneOffsetMinute: number);
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
     * Get data from the UA651BLE
     *
     * UA651BLEからデータを取得
     *
     * @returns data from the UA651BLE UA651BLEから受け取ったデータ
     */
    getDataWait(pairingKeys?: string): Promise<UA651BLEResult[]>;
    private _readSFLOAT_LE;
    private _analyzeData;
    private _getChars;
    private _writeTimeCharWait;
}
