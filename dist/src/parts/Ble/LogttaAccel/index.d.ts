/**
 * @packageDocumentation
 * @module Parts.Logtta_Accel
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface Logtta_AccelOptions {
}
/**
 * scan data from Logtta_Accel
 *
 * Logtta_Accelからのスキャンデータ
 */
export interface Logtta_Accel_ScanData {
    /** Logtta_Accel firmware version Logtta_Accelのファームウェアバージョン */
    revision: number;
    /** sequence number for duplication check 重複判定用シーケンス番号 */
    sequence: number;
    /**
     * remaining battery 電池残量
     *
     * Range 範囲: 0~100 (Unit 単位: 1 %)
     */
    battery: number;
    /** shorted LocalName (the 8 upper bytes) 短縮LocalName (上位8Bytes) */
    name: string;
    setting: {
        /**
         * 温湿度測定周期 temperature and humidity measurement cycle
         *
         * Range 範囲: 1~600 (Unit 単位: 1 s)
         */
        temp_cycle: number;
        /**
         * 加速度サンプリング周波数 acceleration sampling frequency
         *
         * Range 範囲: 800, 400, 200, 100, 50 (Unit 単位: 1 Hz)
         */
        accel_sampling: number;
        /** high-pass filter ハイパスフィルタ */
        hpf: boolean;
        /**
         * 加速度レンジ acceleration range
         *
         * Range 範囲: ±2, ±4, ±8 (Unit 単位: 1 G)
         */
        accel_range: number;
        /**
         * 加速度計測軸 acceleration measurement axis
         *
         * 0b001:Z, 0b010:Y, 0b011:Y/Z, 0b100:X, 0b101:X/Z, 0b110:X/Y, 0b111:X/Y/Z
         */
        accel_axis: number;
        /**
         * 加速度分解能 acceleration resolution
         *
         * Range 範囲: 8, 12 (Unit 単位: bit)
         */
        accel_resolution: number;
    };
    /**
     * temperature 温度
     *
     * (Unit 単位: 1 degC)
     */
    temperature: number;
    /**
     * relative humidity 相対湿度
     *
     * (Unit 単位: 1 %RH)
     */
    humidity: number;
    /** alert status of the last 4 alerts 過去4回分のアラート発生状況 */
    alert: number[];
}
/**
 * acceleration data from Logtta_Accel
 *
 * Logtta_Accelからの加速度データ
 */
export interface Logtta_Accel_AccelData {
    /** X-axis X軸 */
    x: {
        /** acceleration peak data 加速度ピークデータ */
        peak: number;
        /** acceleration RMS data 加速度RMSデータ */
        rms: number;
    };
    /** Y-axis Y軸 */
    y: {
        /** acceleration peak data 加速度ピークデータ */
        peak: number;
        /** acceleration RMS data 加速度RMSデータ */
        rms: number;
    };
    /** Z-axis Z軸 */
    z: {
        /** acceleration peak data 加速度ピークデータ */
        peak: number;
        /** acceleration RMS data 加速度RMSデータ */
        rms: number;
    };
}
/** Logtta_Accel management class Logtta_Accelを管理するクラス */
export default class Logtta_Accel implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the Logtta_Accel
     *
     * 受け取ったPeripheralがLogtta_Accelのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_Accel
     *
     * Logtta_Accelかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a scan data from the Logtta_Accel
     *
     * Note: work only in beacon mode
     *
     * Logtta_Accelからスキャンデータを取得
     *
     * 注: ビーコンモードのときのみ動作
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns scan data from Logtta_Accel
     *
     * Logtta_Accelから受け取ったスキャンデータ
     */
    static getScanData(peripheral: BleRemotePeripheral): Logtta_Accel_ScanData | null;
    /**
     * Get a acceleration data from the Logtta_Accel
     *
     * Note: work only in beacon mode
     *
     * Logtta_Accelから加速度データを取得
     *
     * 注: ビーコンモードのときのみ動作
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns acceleration data from Logtta_Accel
     *
     * Logtta_Accelから受け取った加速度データ
     */
    static getAccelData(peripheral: BleRemotePeripheral): Logtta_Accel_AccelData | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
}
