/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizBleBeaconStruct, ObnizPartsBleCompare } from '../../../obniz/ObnizPartsBleAbstract';
import Logtta from '../utils/abstracts/Logtta';
export interface Logtta_CO2Options {
}
/**
 * data from Logtta_CO2
 *
 * Logtta_CO2から受け取ったデータ
 */
export interface Logtta_CO2_Data extends Logtta_CO2_Connected_Data {
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
 * CO2 concentration data from Logtta_CO2
 *
 * Logtta_CO2からのCO2濃度データ
 */
export interface Logtta_CO2_Connected_Data {
    /**
     * CO2 concentration CO2濃度
     *
     * Range 範囲: 0~65535 (Unit 単位: 1 ppm)
     *
     * (supported value カタログ値: 0~2000)
     */
    co2: number;
}
/** Logtta_CO2 management class Logtta_CO2を管理するクラス */
export default class Logtta_CO2 extends Logtta<Logtta_CO2_Data, Logtta_CO2_Connected_Data> {
    static readonly PartsName = "Logtta_CO2";
    static readonly ServiceUuids: {
        Connectable: string;
        Beacon: null;
    };
    static readonly BeaconDataStruct: ObnizPartsBleCompare<ObnizBleBeaconStruct<Logtta_CO2_Data> | null>;
    /**
     * @deprecated
     *
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
     * @deprecated
     *
     * Verify that the received advertisement is from the Logtta_CO2 (in Beacon Mode)
     *
     * 受け取ったAdvertisementがLogtta_CO2のものかどうか確認する(ビーコンモード中)
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_CO2
     *
     * Logtta_CO2かどうか
     */
    static isAdvDevice(peripheral: BleRemotePeripheral): boolean;
    protected readonly staticClass: typeof Logtta_CO2;
    protected callbackFlag: boolean;
    /**
     * Notify when the CO2 concentration data have got from the Logtta_CO2 with connected state
     *
     * 接続している状態でLogtta_CO2からCO2濃度データを取得したとき通知
     *
     * @returns
     */
    startNotifyWait(callback: (data: Logtta_CO2_Connected_Data) => void): Promise<void>;
    /**
     * @deprecated
     *
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
     * @deprecated
     *
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
    setBeaconMode(enable: boolean): Promise<boolean>;
    protected parseData(data: number[]): Logtta_CO2_Connected_Data;
}
