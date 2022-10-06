/**
 * @packageDocumentation
 * @module Parts.uPRISM
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface uPRISMOptions {
}
/**
 * range of values for the accelerometer 加速度センサーの値の範囲
 */
export declare type AccelRangeType = '2g' | '4g' | '8g' | '16g';
/**
 * data from uPRISM
 *
 * uPRISMからのデータ
 */
export interface uPRISM_Data {
    /**
     * acceleration 加速度
     *
     * Range 範囲: one of the values of {@linkplain AccelRangeType} that you set (default: 2g)
     *
     * 設定した{@linkplain AccelRangeType}のいずれかの値 (デフォルトは2g)
     *
     * Unit 単位: (Range / 4096) G
     *
     * (範囲 / 4096) G
     */
    acceleration: {
        /** X-axis acceleration X軸加速度 */
        x: number;
        /** Y-axis acceleration Y軸加速度 */
        y: number;
        /** Z-axis acceleration Z軸加速度 */
        z: number;
    };
    /** geomagnetism 地磁気
     *
     * Range 範囲: -1300~1300 (Unit 単位: 0.1 uT)
     */
    geomagnetic: {
        /** X-axis geomagnetism X軸地磁気 */
        x: number;
        /** Y-axis geomagnetism Y軸地磁気 */
        y: number;
        /** Z-axis geomagnetism Z軸地磁気 */
        z: number;
    };
    /** timestamp タイムスタンプ */
    time: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
        micro_second: number;
    };
    /** index インデックス */
    index: number;
    /**
     * temperature 気温
     *
     * Range 範囲: -15~55 (Unit 単位: 0.01 degC)
     */
    temperature: number;
    /**
     * relative humidity 湿度
     *
     * Range 範囲: 0~100 (Unit 単位: 0.01 degC)
     */
    humidity: number;
    /**
     * illuminance 照度
     *
     * Range 範囲: 0~128000 (Unit 単位: 1/128 lx)
     */
    ambient_light: number;
    /**
     * UV Index
     *
     * Range 範囲: 0~11+
     */
    uvi: number;
    /**
     * barometric pressure 気圧
     *
     * Range 範囲: 300~1100 (Unit 単位: 0.01 hPa)
     */
    pressure: number;
}
/** uPRISM management class uPRISMを管理するクラス */
export default class uPRISM implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the uPRISM
     *
     * 受け取ったPeripheralがuPRISMのものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the uPRISM
     *
     * uPRISMかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    _peripheral: null | BleRemotePeripheral;
    ondisconnect?: (reason: any) => void;
    /**
     * Event handler for receiving data
     *
     * return data in callback after running {@linkplain startNotifyWait}
     *
     * データ取得のイベントハンドラー
     *
     * {@linkplain startNotifyWait} を実行後コールバックでデータを返す
     */
    onNotify?: (data: uPRISM_Data) => void;
    private readData;
    private readIndex;
    private accelRange;
    private _uuids;
    constructor(peripheral: BleRemotePeripheral | null);
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
     * Set the range of values for the accelerometer
     *
     * uPRISM measures a set range with 4,096 steps of resolution
     *
     * 加速度センサーの値の範囲を設定
     *
     * uPRISMは設定された範囲を4096段階の分解能で計測します
     *
     * @param range range of values for the accelerometer 加速度センサーの値の範囲
     */
    setAccelRange(range: AccelRangeType): void;
    /**
     * Start notifying when the data have got from the uPRISM with connected state
     *
     * 接続状態でuPRISMからデータを取得したときの通知を開始
     */
    startNotifyWait(): Promise<void>;
    /**
     * Stop data notification
     *
     * データの通知を停止
     *
     * @returns
     */
    stopNotifyWait(): Promise<void>;
}
