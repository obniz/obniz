/**
 * @packageDocumentation
 * @module Parts.DR_MARK
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface } from '../../../obniz/ObnizPartsBleInterface';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import { BleBatteryService } from '../utils/services/batteryService';
export declare type CommandResultType = 'ok' | 'errorId' | 'errorMode' | 'errorExecution' | 'errorParams' | 'errorFrom' | 'errorTimeout' | 'errorObject';
export declare type CallbackFunctionType = (data: CommandNotifyData) => void;
export declare type ActionModeType = 'stop' | 'adjust' | 'monitor' | 'suspend' | 'finish' | 'log';
export declare type SetActionModeType = 'start' | 'stop' | 'adjust' | 'monitor' | 'pause' | 'log';
export interface CommandNotifyData {
    commandId: number;
    result: CommandResultType;
    data: number[];
}
export interface PulseData {
    sequenceNumber: number;
    pulse: number;
    status: number;
    error: {
        outRange: boolean;
        changeSetting: boolean;
        overSumFlow: boolean;
        lowInstantFlow: boolean;
        highInstantFlow: boolean;
        shutdownBattery: boolean;
        lowBattery: boolean;
        isError: boolean;
    };
    instantFlowRate: number;
    sumFlowRate: number;
    averageFlowRate: number;
    batteryVoltage: number;
}
export interface ConditionSettingData {
    infusionDropCount: number;
    targetSumFlowRate: number;
    targetFlowRate: number;
    correctionFactor: number;
}
export interface BaseSettingData {
    effectiveInstantFlowRate: number;
    finishJudgmentSec: number;
    effectiveIntegratedFlowRate: number;
    powerOffSec: number;
}
export interface EngineerSettingData {
    movingAverage: number;
    lowVoltage: number;
    shutdownVoltage: number;
    offsetSec: number;
}
export interface FlashRomInfoData {
    total: number;
    startDate?: Date;
    endDate?: Date;
}
export interface FlashRomSearchData {
    total: number;
    hit: number;
    startIndex?: number;
    endIndex?: number;
}
export interface FlashRomHistoryData {
    index: number;
    monitoringStatus: {
        outRange: boolean;
        changeSetting: boolean;
        overSumFlow: boolean;
        lowInstantFlow: boolean;
        highInstantFlow: boolean;
        shutdownBattery: boolean;
        lowBattery: boolean;
        isError: boolean;
    };
    monitoringResultStatus: {
        shutdownBattery: boolean;
        swFinish: boolean;
        userFinish: boolean;
        overSumFlow: boolean;
        lowSumFlow: boolean;
        isError: boolean;
    };
    averageFlowRate: number;
    sumFlowRate: number;
    startDatetime: Date;
    endDatetime: Date;
    startBatteryVoltage: number;
    endBatteryVoltage: number;
    logIndex: number;
    reserved1: number;
    infusionDropCount: number;
    targetSumFlowRate: number;
    targetFlowRate: number;
    correctionFactor: number;
    effectiveInstantFlowRate: number;
    finishJudgmentSec: number;
    effectiveIntegratedFlowRate: number;
    powerOffSec: number;
    reserved2: number;
}
export interface DR_MARKOptions {
}
/** DR MARK management class DR MARKを管理するクラス */
export default class DR_MARK implements ObnizPartsBleInterface {
    static info(): ObnizPartsInfo;
    /**
     * Verify that the received peripheral is from the DR MARK
     *
     * 受け取ったperipheralがDR MARKのものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the DR MARK
     *
     * DR MARKかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    keys: string[];
    requiredKeys: string[];
    params: any;
    static onnotify: ((data: CommandNotifyData) => void) | null;
    static onfinish: (() => void) | null;
    static onpulse: ((pulseData: PulseData) => void) | null;
    private onsystempulse;
    _peripheral: BleRemotePeripheral | null;
    ondisconnect?: (reason: any) => void;
    batteryService?: BleBatteryService;
    private _uuids;
    private _deviceInfoSystem;
    private _requestChar;
    private callbackArray;
    private static pulseDataArray;
    constructor(peripheral: BleRemotePeripheral | null);
    /**
     * Connect the sensor
     *
     * Throw an error if the device is not found
     *
     * センサへ接続
     *
     * デバイスが見つからなかった場合はエラーをthrow
     */
    connectWait(): Promise<void>;
    /**
     * Disconnect from the sensor
     *
     * センサから切断
     */
    disconnectWait(): Promise<void>;
    /**
     * Get the System ID from the sensor
     *
     * 8 バイトの固有ID
     * 6 バイトの BD アドレスを逆順にし、真中に 0000 を追加
     * 例)BD アドレスが< 18:04:ED:3B:7B:18 >の場合
     * System ID は、< 187B3B0000ED0418 >になる
     *
     * @returns value System ID
     *
     */
    getSystemIdWait(): Promise<string | null>;
    /**
     * Get the FirmwareVersion from the sensor
     *
     * FW バージョン
     * 例) “0.04(2020/09/04)”
     *
     * @returns value FW バージョン
     *
     */
    getFirmwareVersionWait(): Promise<string | null>;
    /**
     * DR MARKにコマンドを送る
     *
     * @param commandId REQUESTコマンド(00h ～ 7Fh)
     * @param data 送信データ(詳細は下記)
     *
     * 17 Bytes 固定
     * 使われない領域は、00h にクリア
     * 2Bytes 以上のデータ(WORD, DWORD 等)は、LITTLE-ENDIAN
     */
    writeCommandWait(commandId: number, data?: Uint8Array): Promise<void>;
    /**
     * 動作モード取得
     */
    getActionModeWait(): Promise<ActionModeType>;
    /**
     * 動作モード設定
     *
     * @param mode 動作モード
     */
    setActionModeWait(mode: SetActionModeType): Promise<void>;
    /**
     * RTC set
     *
     * @param timeOffsetMinute 時差を入れる
     */
    setRtcWait(timeOffsetMinute: number): Promise<void>;
    /**
     * RTC get
     *
     * @param timeOffsetMinute 時差を入れる
     */
    getRtcWait(timeOffsetMinute: number): Promise<Date>;
    /**
     * 接続確認
     */
    checkConnectWait(): Promise<void>;
    /**
     * 計測データ送信リクエスト
     */
    requestPulseDataWait(enable: boolean): Promise<void>;
    /**
     * 計測条件設定
     *
     * @param infusionDropCount 輸液セットタイプ default 20滴
     * @param targetSumFlowRate 設定量 (ml) default 500ml
     * @param targetFlowRate 目標流量(ml/h) default 250ml/h
     * @param correctionFactor 流量を補正する(-20% ～ 20%) default 0%
     */
    setConditionSettingWait(infusionDropCount: number, targetSumFlowRate: number, targetFlowRate: number, correctionFactor: number): Promise<void>;
    /**
     * 基本設定
     *
     * @param effectiveInstantFlowRate 有効瞬時流量(%) 瞬時流量判定に使用 目標流量に対する瞬時流量の差分 default 30%
     * @param finishJudgmentSec 輸液終了判定時間(秒後) 輸液終了判定（センサ信号無応答時間） default 60秒後
     * @param effectiveIntegratedFlowRate 有効積算流量(%) 総積算流量を判定する ※計測中の流量異常判定無効区間を算出 default 10%
     * @param powerOffSec 自動電源断時間(秒後) default 60秒後
     */
    setBaseSettingWait(effectiveInstantFlowRate: number, finishJudgmentSec: number, effectiveIntegratedFlowRate: number, powerOffSec: number): Promise<void>;
    /**
     * エンジニア設定
     *
     * @param movingAverage 移動平均回数(回) 最大30回 default 30回
     * @param lowVoltage Lowバッテリ判定レベル(mv) この電圧値以下で黄色LED ハーフ点灯 default 3400mv
     * @param shutdownVoltage バッテリ電源断レベル(mv) この電圧値以下で電源断実行 default 3300mv
     * @param offsetSec 時刻補正(秒) 時刻設定時の遅延時間補正 default 0秒
     */
    setEngineerSettingWait(movingAverage: number, lowVoltage: number, shutdownVoltage: number, offsetSec: number): Promise<void>;
    /**
     * LED設定
     *
     * @param bright LED 調光(trueの時明るい)
     */
    setLedSettingWait(bright: boolean): Promise<void>;
    /**
     * 計測条件取得
     *
     * @return ConditionSettingData
     */
    getConditionSettingWait(): Promise<ConditionSettingData>;
    /**
     * 基本設定取得
     *
     * @return BaseSettingData
     */
    getBaseSettingWait(): Promise<BaseSettingData>;
    /**
     * エンジニア設定
     *
     * @return EngineerSettingData
     */
    getEngineerSettingWait(): Promise<EngineerSettingData>;
    /**
     * LED設定
     *
     * @return true:bright mode
     */
    isBrightLedWait(): Promise<boolean>;
    /**
     * 電圧値読出し
     *
     * @return バッテリ電圧（mV）
     */
    getBatteryVoltageWait(): Promise<number>;
    /**
     * Pulseデータをの取得を開始
     */
    startPulseDataWait(): Promise<void>;
    /**
     * Pulseデータの取得を停止かつ、開始時からのパルスデータの配列を返却
     */
    stopPulseDataWait(): Promise<PulseData[]>;
    /**
     * Pulseデータを1件取得する
     */
    getPulseDataWait(timeoutMs?: number): Promise<PulseData>;
    /**
     * Erase FlashROM
     *
     */
    eraseFlashRomWait(): Promise<void>;
    /**
     * FlashROMに保存されているデータ数確認用
     * 最新の計測日時と最古の計測日時を確認できる
     *
     * @param timeOffsetMinute 時差を入れる
     * @return FlashRomInfoData
     */
    getFlashRomInfoWait(timeOffsetMinute: number): Promise<FlashRomInfoData>;
    /**
     * FlashROMに保存されているデータ数確認用
     * 最新の計測日時と最古の計測日時を確認できる
     *
     * @param startDate 検索開始日(UTC)
     * @param endDate 検索終了日(UTC)
     * @param timeOffsetMinute 時差を入れる
     * @return FlashRomSearchData
     */
    getFlashRomSearchWait(startDate: Date, endDate: Date, timeOffsetMinute: number): Promise<FlashRomSearchData>;
    /**
     * FlashROMに保存されている計測履歴を取得
     * 終了モードの時に0xFFFFでリクエストすると最新の結果を取得
     * それ以外の場合は、getFlashRomSearchWaitで取得したIndexを元に取得する
     *
     * @param index データIndex
     * @param timeOffsetMinute 時差を入れる
     * @return FlashRomHistoryData
     */
    getFlashRomHistoryDataWait(index: number, timeOffsetMinute: number): Promise<FlashRomHistoryData>;
    private convertBufferToDate;
    private getCommandResultWait;
    private createCommandCallback;
    private getCommandFlashRomHistoryWait;
    private setCommandCallback;
    private removeCommandCallback;
    notifyCallback: (data: number[]) => void;
}
