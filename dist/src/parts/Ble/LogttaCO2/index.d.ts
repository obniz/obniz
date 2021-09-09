/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import BleBatteryService from '../utils/services/batteryService';
import BleGenericAccess from '../utils/services/genericAccess';
export interface Logtta_CO2Options {
}
/**
 * advertisement data from Logtta_CO2
 *
 * Logtta_CO2からのadvertisementデータ
 */
export interface Logtta_CO2_Adv_Data {
    /**
     * CO2 concentration CO2濃度
     *
     * Range 範囲: 0~65535 (Unit 単位: 1 ppm)
     *
     * (supported value カタログ値: 0~2000)
     */
    co2: number;
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
/** Logtta_CO2 management class Logtta_CO2を管理するクラス */
export default class Logtta_CO2 implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the Logtta_CO2
     *
     * 受け取ったPeripheralがLogtta_CO2のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_CO2
     *
     * Logtta_CO2かどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Verify that the received advertisement is from the Logtta_CO2
     *
     * 受け取ったAdvertisementがLogtta_CO2のものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_CO2
     *
     * Logtta_CO2かどうか
     */
    static isAdvDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the Logtta_CO2 advertisement
     *
     * Logtta_CO2のadvertisementからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Logtta_CO2 advertisement
     *
     * Logtta_CO2のadvertisementからのデータ
     */
    static getData(peripheral: BleRemotePeripheral): Logtta_CO2_Adv_Data | null;
    private static getName;
    private static get_uuid;
    onNotify?: (co2: number) => void;
    _peripheral: BleRemotePeripheral | null;
    ondisconnect?: (reason: any) => void;
    genericAccess?: BleGenericAccess;
    batteryService?: BleBatteryService;
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
     * Get CO2 concentration data with connected state
     *
     * 接続している状態でCO2濃度データを取得
     *
     * @returns CO2 concentration data from the Logtta_CO2
     *
     * Logtta_CO2から受け取ったCO2濃度データ
     */
    getWait(): Promise<number | null>;
    /**
     * Notify when the CO2 concentration data have got from the Logtta_CO2 with connected state
     *
     * 接続している状態でLogtta_CO2からCO2濃度データを取得したとき通知
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
     *
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
