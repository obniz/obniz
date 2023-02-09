/**
 * @packageDocumentation
 * @module Parts.RS_BTEVS1
 */
import { BleRemotePeripheral } from '../../../obniz';
import { ObnizBleBeaconStruct, ObnizPartsBleCompare, ObnizPartsBleConnectable, ObnizPartsBleMode } from '../../../obniz/ObnizPartsBleAbstract';
export interface RS_BTEVS1Options {
}
/** RS-BTEVS1 advertising data RS-BTEVS1のアドバタイジングデータ */
export interface RS_BTEVS1_Data {
    /** CO2 [ppm] */
    co2: number;
    /** PM1.0 [ug/m3] */
    pm1_0: number;
    /** PM2.5 [ug/m3] */
    pm2_5: number;
    /** PM4.0 [ug/m3] */
    pm4_0: number;
    /** PM10.0 [ug/m3] */
    pm10_0: number;
    /** temperature 温度 [℃] */
    temp: number;
    /** humidity 湿度 [%] */
    humid: number;
}
declare const LED_DISPLAY_MODE: readonly ["Disable", "PM2.5", "CO2"];
declare const PM2_5_CONCENTRATION_MODE: readonly ["Mass", "Number"];
/** RS-BTEVS1 config RS-BTEVS1の設定内容 */
export interface RS_BTEVS1_Config {
    /**
     * Temperature notification interval [ms] (10,000~3,600,000) (Initial value: 10,000ms)
     *
     * 温度通知間隔[ms] (10,000~3,600,000) (初期値: 10,000ms)
     */
    tempInterval: number;
    /**
     * PM2.5 notification interval [ms] (10,000~3,600,000) (Initial value: 10,000ms)
     *
     * PM2.5通知間隔[ms] (10,000~3,600,000) (初期値: 10,000ms)
     */
    pm2_5Interval: number;
    /**
     * CO2 notification interval [ms] (10,000~3,600,000) (Initial value: 10,000ms)
     *
     * CO2通知間隔[ms] (10,000~3,600,000) (初期値: 10,000ms)
     */
    co2Interval: number;
    /**
     * Temperature sensor measurement operation setting (initial value: Disable)
     *
     * 温度センサー計測動作設定 (初期値: 無効)
     */
    tempMeasureOperation: boolean;
    /**
     * PM2.5 sensor measurement operation setting (initial value: Disable)
     *
     * PM2.5センサー計測動作設定 (初期値: 無効)
     */
    pm2_5MeasureOperation: boolean;
    /**
     * CO2 sensor measurement operation setting (initial value: Disable)
     *
     * CO2センサー計測動作設定 (初期値: 無効)
     */
    co2MeasureOperation: boolean;
    /**
     * Display setting for 10 LEDs (Disable | PM2.5 | CO2) (initial value: Disable)
     *
     * 10連LEDへの表示設定 (Disable | PM2.5 | CO2) (初期値: 無効)
     */
    ledDisplay: typeof LED_DISPLAY_MODE[number];
    /**
     * Advertisement Beacon Settings (Initial Value: Disable)
     *
     * アドバタイズビーコン設定 (初期値: 無効)
     */
    advertisementBeacon: boolean;
    /**
     * @deprecated Rev. ~1.0.2
     * PM2.5 mass concentration / number concentration mode setting (Mass | Number) (initial value: Number)
     *
     * PM2.5質量濃度/個数濃度モード設定 (Mass | Number) (初期値: 個数濃度)
     */
    pm2_5ConcentrationMode: typeof PM2_5_CONCENTRATION_MODE[number];
}
/** RS-BTEVS1 PM2.5 data RS-BTEVS1のPM2.5のデータ */
export interface RS_BTEVS1_Pm2_5 {
    /** PM1.0 [ug/m3] */
    mass_pm1: number;
    /** PM2.5 [ug/m3] */
    mass_pm2_5: number;
    /** PM4.0 [ug/m3] */
    mass_pm4: number;
    /** PM10.0 [ug/m3] */
    mass_pm10: number;
    /** PM0.5 [#/m3] */
    number_pm0_5?: number;
    /** PM1.0 [#/m3] */
    number_pm1?: number;
    /** PM2.5 [#/m3] */
    number_pm2_5?: number;
    /** PM4.0 [#/m3] */
    number_pm4?: number;
    /** PM10.0 [#/m3] */
    number_pm10?: number;
}
/** RS_BTEVS1 management class RS_BTEVS1を管理するクラス */
export default class RS_BTEVS1 extends ObnizPartsBleConnectable<RS_BTEVS1_Data, RS_BTEVS1_Data> {
    static readonly AvailableBleMode: ObnizPartsBleMode | ObnizPartsBleMode[];
    static readonly PartsName = "RS_BTEVS1";
    /**
     * BTEVS-1234: ~1.0.2
     * EVS-1234: 1.1.2~
     * EVS_1234 1.2~
     */
    static readonly LocalName: RegExp;
    static readonly CompanyID: ObnizPartsBleCompare<number[] | null>;
    static readonly BeaconDataStruct: ObnizPartsBleCompare<ObnizBleBeaconStruct<RS_BTEVS1_Data> | null>;
    protected staticClass: typeof RS_BTEVS1;
    /** Event handler for button ボタンのイベントハンドラー */
    onButtonPressed: ((pressed: boolean) => void) | null;
    /** Event handler for temperature sensor 温度センサーのイベントハンドラー */
    onTempMeasured: ((temp: number, humidity: number) => void) | null;
    /** Event handler for co2 sensor CO2センサーのイベントハンドラー */
    onCo2Measured: ((co2: number) => void) | null;
    /** Event handler for PM2.5 sensor PM2.5センサーのイベントハンドラー */
    onPm2_5Measured: ((pm2_5: RS_BTEVS1_Pm2_5) => void) | null;
    protected readonly serviceUuid = "F9CC15234E0A49E58CF30007E819EA1E";
    firmwareRevision: string;
    private firmwareSemRevision;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Connect to the services of a device
     *
     * デバイスのサービスに接続
     */
    connectWait(): Promise<void>;
    private static _deviceAdvAnalyzer;
    static getData(peripheral: BleRemotePeripheral): RS_BTEVS1_Data | null;
    /**
     * Get device all data
     * Version 1.0.x is not supported
     * デバイスの全てのデータの取得
     * バージョン1.0.xはサポートされません
     *
     * @returns
     */
    getDataWait(): Promise<RS_BTEVS1_Data>;
    protected beforeOnDisconnectWait(): Promise<void>;
    /**
     * Get device settings デバイスの設定を取得
     *
     * @returns Instance of RS_BTEVS1_Config RS_BTEVS1_Configのインスタンス
     */
    getConfigWait(): Promise<RS_BTEVS1_Config>;
    /**
     * Write device settings, blanks write initial values
     *
     * デバイス設定の書き込み、空欄は初期値を書き込み
     *
     * @param config Instance of RS_BTEVS1_Config RS_BTEVS1_Configのインスタンス
     * @returns Write result 書き込み結果
     */
    setConfigWait(config: Partial<RS_BTEVS1_Config>): Promise<boolean>;
    /**
     * Change pairing LED flashing status
     * Version 1.0.x is not supported
     * ペアリングLEDの点滅状態の変更
     * バージョン1.0.xはサポートされません
     *
     * @param blink Whether it blinks 点滅するかどうか
     * @returns Write result 書き込み結果
     */
    setModeLEDWait(blink: boolean): Promise<boolean>;
    /**
     * Start reading the button state
     *
     * ボタンの状態読み取りを開始
     */
    buttonChangeStartWait(): Promise<void>;
    /**
     * @deprecated
     *
     * Start reading the temperature sensor
     * Version 1.0.x is not supported
     * 温度センサーの読み取りを開始
     * バージョン1.0.xはサポートされません
     */
    tempMeasureStartWait(): Promise<void>;
    /**
     * @deprecated
     *
     * Start reading the co2 sensor
     *
     * CO2センサーの読み取りを開始
     */
    co2MeasureStartWait(): Promise<void>;
    /**
     * @deprecated
     *
     * Start reading the PM2.5 sensor
     * Version 1.1 is not supported
     * PM2.5センサーの読み取りを開始
     * バージョン1.1より上のバージョンはサポートされません
     */
    pm2_5MeasureStartWait(): Promise<void>;
    protected getCharUuid(code: number): string;
    private checkVersion;
    private checkLessVersion;
}
export {};
