/**
 * @packageDocumentation
 * @module Parts.Logtta_TH
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface Logtta_THOptions {
}
/**
 * data from Logtta_TH(Logtta_Temp) with connected state
 *
 * 接続した状態でのLogtta_TH(Logtta_Temp)からのデータ
 */
export interface Logtta_TH_Data {
    /**
     * temperature 温度
     *
     * Range 範囲: -20~60 (Unit 単位: degC)
     */
    temperature: number;
    /**
     * relative humidity 湿度
     *
     * Range 範囲 0~100 (Unit 単位: %RH)
     */
    humidity: number;
}
/**
 * advertisement data from Logtta_TH(Logtta_Temp)
 *
 * Logtta_TH(Logtta_Temp)からのadvertisementデータ
 */
export interface Logtta_TH_Adv_Data {
    /**
     * temperature 温度
     *
     * Range 範囲: -20~60 (Unit 単位: degC)
     */
    temperature: number;
    /**
     * relative humidity 湿度
     *
     * Range 範囲 0~100 (Unit 単位: %RH)
     */
    humidity: number;
    /**
     * remaining battery 電池残量
     *
     * Range 範囲: 0~100 (Unit 単位: 1 %)
     *
     * 254: USB power supply USB給電
     */
    battery: number;
    /**
     * measurement interval 測定周期
     *
     * Range 範囲: 1~2100 (Unit 単位: 1 s)
     */
    interval: number;
    /** BLE address BLEアドレス */
    address: string;
}
/**
 * Logtta_TH(Logtta_Temp) management class
 *
 * Logtta_TH(Logtta_Temp)を管理するクラス
 */
export default class Logtta_TH implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the Logtta_TH(Logtta_Temp)
     *
     * 受け取ったPeripheralがLogtta_TH(Logtta_Temp)のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_TH(Logtta_Temp)
     *
     * Logtta_TH(Logtta_Temp)かどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Verify that the received advertisement is from the Logtta_TH(Logtta_Temp)
     *
     * 受け取ったAdvertisementがLogtta_TH(Logtta_Temp)のものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_TH(Logtta_Temp)
     *
     * Logtta_TH(Logtta_Temp)かどうか
     */
    static isAdvDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the Logtta_TH(Logtta_Temp) advertisement
     *
     * Logtta_TH(Logtta_Temp)のadvertisementからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Logtta_TH(Logtta_Temp) advertisement
     *
     * Logtta_TH(Logtta_Temp)のadvertisementからのデータ
     */
    static getData(peripheral: BleRemotePeripheral): Logtta_TH_Adv_Data | null;
    private static getName;
    private static get_uuid;
    onNotify?: (data: Logtta_TH_Data) => void;
    _peripheral: null | BleRemotePeripheral;
    ondisconnect?: (reason: any) => void;
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
     * センサとの接続を切断
     */
    disconnectWait(): Promise<void>;
    /**
     * Get the both temperature and humidity data with connected state
     *
     * 接続している状態で温度と湿度の両方のデータを取得
     *
     * @returns both temperature and humidity data from the Logtta_TH(Logtta_Temp)
     *
     * Logtta_TH(Logtta_Temp)から受け取った温度と湿度の両方のデータ
     */
    getAllWait(): Promise<Logtta_TH_Data | null>;
    /**
     * Get the temperature data with connected state
     *
     * 接続している状態で温度のデータを取得
     *
     * @returns temperature data from the Logtta_TH(Logtta_Temp)
     *
     * Logtta_TH(Logtta_Temp)から受け取った温度データ
     */
    getTemperatureWait(): Promise<number>;
    /**
     * Get the humidity data with connected state
     *
     * 接続している状態で湿度のデータを取得
     *
     * @returns humidity data from the Logtta_TH(Logtta_Temp)
     *
     * Logtta_TH(Logtta_Temp)から受け取った湿度データ
     */
    getHumidityWait(): Promise<number>;
    /**
     * Notify when the data have got from the Logtta_TH(Logtta_Temp) with connected state
     *
     * 接続している状態でLogtta_TH(Logtta_Temp)からデータを取得したとき通知
     *
     * @returns
     */
    startNotifyWait(): Promise<void>;
    /**
     * Authenticate with the sensor using pin code
     *
     * ピンコードによってセンサと認証
     *
     * @param code pin code (default: "0000")
     *
     * ピンコード (デフォルト: "0000")
     *
     * @returns
     */
    authPinCodeWait(code: string): Promise<void>;
    /**
     * @deprecated Please use {@linkplain setBeaconModeWait}
     *
     * {@linkplain setBeaconModeWait} の使用を推奨
     *
     * @param enable enable the beacon mode or not ビーコンモードを有効にするかどうか
     */
    setBeaconMode(enable: boolean): Promise<void>;
    /**
     * Set enable / disable for beacon mode (periodic beacon transmission)
     *
     * Call this function after authenticating with the sensor
     *
     * After setting, disconnect once to enable it
     *
     * To stop beacon mode, you need to hold the button on the sensor for more than 2 seconds
     *
     * (For more detail, please see http://www.uni-elec.co.jp/logtta_page.html )
     *
     * ビーコンモード(定期的なビーコン発信)の有効/無効の設定
     *
     * センサとの認証を済ませた状態で実行してください
     *
     * 設定後に切断した後から有効になります
     *
     * ビーコンモードの終了は、デバイスのボタンを2秒以上長押しする操作が必要です(詳しくは http://www.uni-elec.co.jp/logtta_page.html )
     *
     * @param enable enable the beacon mode or not ビーコンモードを有効にするかどうか
     *
     * @returns
     */
    setBeaconModeWait(enable: boolean): Promise<void>;
    private checkNumber;
}
