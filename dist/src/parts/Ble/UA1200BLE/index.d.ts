/**
 * @packageDocumentation
 * @module Parts.UA1200BLE
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import { BleBatteryService } from '../utils/services/batteryService';
import { BleGenericAccess } from '../utils/services/genericAccess';
export interface UA1200BLEOptions {
}
/**
 * blood pressure data from UA651BLE
 *
 * (blood pressure will return either mmHg or kPa unit)
 *
 * UA1200BLEからの血圧データ
 *
 * (血圧はmmHg形式かkPa形式のどちらかが返ってきます)
 */
export interface UA1200BLEResult {
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
}
/** UA1200BLE management class UA1200BLEを管理するクラス */
export default class UA1200BLE implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the UA1200BLE
     *
     * 受け取ったPeripheralがUA1200BLEのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is UA1200BLE
     *
     * UA1200BLEかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean | "" | null;
    /**
     * Judge whether it is cooperation mode
     *
     * (When in cooperation mode, no data exists even when connected)
     *
     * 連携モードかどうかの判定
     *
     * (連携モードのときは接続してもデータが存在しません)
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is cooperation mode or not
     *
     * 連携モードかどうか
     */
    static isCooperationMode(peripheral: BleRemotePeripheral): boolean;
    onNotify?: (co2: number) => void;
    _peripheral: BleRemotePeripheral | null;
    ondisconnect?: (reason: any) => void;
    genericAccess?: BleGenericAccess;
    batteryService?: BleBatteryService;
    _modeFlag?: boolean;
    private _timezoneOffsetMinute;
    constructor(peripheral: BleRemotePeripheral | null, timezoneOffsetMinute: number);
    /**
     * Pair with the device
     *
     * デバイスとペアリング
     *
     * @returns pairing key ペアリングキー
     */
    pairingWait(): Promise<string | null>;
    /**
     * Get data from the UA1200BLE
     *
     * UA1200BLEからデータを取得
     *
     * @returns data from the UA1200BLE UA1200BLEから受け取ったデータ
     */
    getDataWait(): Promise<UA1200BLEResult[]>;
    private _readSFLOAT_LE;
    private _analyzeData;
    private _getCharsCoopMode;
    private _getCharsSingleMode;
    private _writeTimeCharWait;
}
