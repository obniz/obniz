/**
 * @packageDocumentation
 * @module Parts.RS_BTEVS1
 */
import Obniz, { BleRemotePeripheral } from '../../../obniz';
import ObnizPartsInterface, { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface RS_BTEVS1Options {
}
/** RS-BTEVS1 advertising data RS-BTEVS1のアドバタイジングデータ */
export interface RS_BTEVS1_AdvData {
    /** CO2 [ppm] */
    co2: number;
    /** PM1.0 [ug/m3] */
    pm1_0: number;
    /** PM2.5 [ug/m3] */
    pm2_5: number;
    /** PM5.0 [ug/m3] */
    pm5_0: number;
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
    /** PM2.5 mass concentration / number concentration mode setting (Mass | Number) (initial value: Number)
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
    /** PM5.0 [ug/m3] */
    mass_pm5: number;
    /** PM10.0 [ug/m3] */
    mass_pm10: number;
    /** PM0.5 [#/m3] */
    number_pm0_5: number;
    /** PM1.0 [#/m3] */
    number_pm1?: number;
    /** PM2.5 [#/m3] */
    number_pm2_5?: number;
    /** PM5.0 [#/m3] */
    number_pm5?: number;
    /** PM10.0 [#/m3] */
    number_pm10?: number;
}
/** RS_BTEVS1 management class RS_BTEVS1を管理するクラス */
export default class RS_BTEVS1 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    /**
     * Determine if it is RS-BTEVS1
     *
     * RS-BTEVS1かどうか判定
     *
     * @param peripheral Instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     * @returns Whether it is RS-BTEVS1 RS-BTEVS1かどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get advertising data
     *
     * アドバタイジングデータを取得
     *
     * @param peripheral Instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     * @returns RS-BTEVS1 advertising data RS-BTEVS1のアドバタイジングデータ
     */
    static getData(peripheral: BleRemotePeripheral): RS_BTEVS1_AdvData | null;
    /** RS-BTEVS1 sample advertising data RS-BTEVS1のサンプルのアドバタイジングデータ */
    private static deviceAdv;
    keys: string[];
    requiredKeys: string[];
    params: any;
    /** Event handler for button ボタンのイベントハンドラー */
    onButtonPressed: ((pressed: boolean) => void) | null;
    /** Event handler for temperature sensor 温度センサーのイベントハンドラー */
    onTempMeasured: ((temp: number, humidity: number) => void) | null;
    /** Event handler for co2 sensor CO2センサーのイベントハンドラー */
    onCo2Measured: ((co2: number) => void) | null;
    /** Event handler for PM2.5 sensor PM2.5センサーのイベントハンドラー */
    onPm2_5Measured: ((pm2_5: RS_BTEVS1_Pm2_5) => void) | null;
    /** Instance of BleRemotePeripheral BleRemotePeripheralのインスタンス */
    _peripheral: BleRemotePeripheral | null;
    /** Event handler for disconnect 切断のイベントハンドラー */
    ondisconnect?: (reason: any) => void;
    private _uuids;
    private _buttonCharacteristic;
    private _configCharacteristic;
    private _tempCharacteristic;
    private _co2Characteristic;
    private _pm2_5Characteristic;
    constructor(peripheral: BleRemotePeripheral | null);
    wired(obniz: Obniz): void;
    /**
     * Connect to device デバイスに接続
     */
    connectWait(): Promise<void>;
    /**
     * Disconnect from device デバイスから切断
     */
    disconnectWait(): Promise<void>;
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
     * Start reading the temperature sensor
     *
     * 温度センサーの読み取りを開始
     */
    tempMeasureStartWait(): Promise<void>;
    /**
     * Start reading the co2 sensor
     *
     * CO2センサーの読み取りを開始
     */
    co2MeasureStartWait(): Promise<void>;
    /**
     * Start reading the PM2.5 sensor
     *
     * PM2.5センサーの読み取りを開始
     */
    pm2_5MeasureStartWait(): Promise<void>;
    /**
     * Send 1 to Descriptor of Characteristic argument
     *
     * 引数のCharacteristicのDescriptorに1を送信
     *
     * @param char Instance of BleRemoteCharacteristic BleRemoteCharacteristicのインスタンス
     */
    private _measureStartWait;
}
export {};
