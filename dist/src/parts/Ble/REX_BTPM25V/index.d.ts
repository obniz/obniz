/**
 * @packageDocumentation
 * @module Parts.REX_BTPM25V
 */
import Obniz from '../../../obniz';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface REX_BTPM25VOptions {
}
/** REX_BTPM25V management class REX_BTPM25Vを管理するクラス */
export default class REX_BTPM25V implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    /**
     * Verify that the received peripheral is from the REX_BTPM25V
     *
     * 受け取ったPeripheralがREX_BTPM25Vのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the REX_BTPM25V
     *
     * REX_BTPM25Vかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    keys: string[];
    requiredKeys: string[];
    params: any;
    /**
     * Callback when the button is pressed
     *
     * ボタンが押されたときにコールバック
     */
    onbuttonpressed: ((pressed: boolean) => void) | null;
    _peripheral: BleRemotePeripheral | null;
    ondisconnect?: (reason: any) => void;
    private _uuids;
    private _oneShotMeasurementCharacteristic;
    private _continuousMeasurementCharacteristic;
    private _ledCharacteristic;
    private _buttonCharacteristic;
    constructor(peripheral: BleRemotePeripheral | null);
    wired(obniz: Obniz): void;
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
     * Do one shot measurement
     *
     * ワンショット計測
     *
     * @returns one shot measurement data ワンショット計測データ
     *
     * ```
     * {
     *
     * pm2_5: PM2.5 concentration PM2.5濃度 (25~1000 [ug/m3]),
     *
     * pm10: PM10 concentration M10濃度 (25~1000 [ug/m3]),
     *
     * barometricPressure: barometric pressure 気圧 (300~1100 [hPa]),
     *
     * temperature: temperature 温度 (-20~85 [degC]),
     *
     * humidity: relative humidity 湿度 (10~70 [%RH]),
     *
     * lux: illuminance 照度 (0~65535 [lx]),
     *
     * mode: mode flag モードフラグ (0: 連続計測, 1: 最新計測データ, 3: ワンショット)
     *
     * }
     * ```
     *
     */
    measureOneShotWait(): Promise<{
        pm2_5: number;
        pm10: number;
        barometricPressure: number;
        temperature: number;
        humidity: number;
        lux: number;
        mode: number;
    }>;
    /**
     * Do extended one shot measurement
     *
     * 拡張ワンショット計測
     *
     * @returns one extended shot measurement data 拡張ワンショット計測データ
     *
     * ```
     * {
     *
     * pm2_5: PM2.5 concentration PM2.5濃度 (25~1000 [ug/m3]),
     *
     * pm10: PM10 concentration M10濃度 (25~1000 [ug/m3]),
     *
     * barometricPressure: barometric pressure 気圧 (300.0~1100.0 [hPa]),
     *
     * temperature: temperature 温度 (-20.0~85.0 [degC]),
     *
     * humidity: relative humidity 湿度 (0.0~100.0 [%RH]),
     *
     * lux: illuminance 照度 (0~65534 [lx]),
     *
     * tvoc: TVOC (Total Volatile Organic Compounds) (0~1187 [ppb])
     *
     * eco2: eCO2 (equivalent CO2) 等価CO2濃度 (400~8190 [ppm])
     *
     * uv: UV Index (0~11)
     *
     * }
     * ```
     */
    measureOneShotExtWait(): Promise<{
        pm2_5: number;
        pm10: number;
        barometricPressure: number;
        temperature: number;
        humidity: number;
        lux: number;
        tvoc: number;
        eco2: number;
        uv: number;
    }>;
    /**
     * @deprecated Please use {@linkplain getLedModeWait}
     *
     * {@linkplain getLedModeWait} の使用を推奨
     *
     * @returns
     */
    getLedMode(): Promise<void>;
    /**
     * Get LED mode LEDモードの取得
     *
     * @returns current LED mode 現在のLEDモード
     *
     * 0: off 消灯
     *
     * 1: PM2.5 mode PM2.5モード
     *
     * 2: PM10 mode PM10モード
     *
     * 3: VOC mode VOCモード
     *
     * 4: UV mode UVモード
     *
     * 5: temperature mode 温度モード
     *
     * 6: humidity mode 湿度モード
     *
     * 128: power LED 電源LED
     */
    getLedModeWait(): Promise<void>;
    private _sendAndReceiveWait;
    private _analyzeResult;
    private _bitValue;
    private _analyzeResultExt;
}
