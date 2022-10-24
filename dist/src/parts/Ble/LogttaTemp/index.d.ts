/**
 * @packageDocumentation
 * @module Parts.Logtta_TH
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizBleBeaconStruct, ObnizPartsBleCompare, ObnizPartsBleMode } from '../../../obniz/ObnizPartsBleAbstract';
import Logtta from '../utils/abstracts/Logtta';
export interface Logtta_THOptions {
}
/**
 * data from Logtta_TH(Logtta_Temp)
 *
 * Logtta_TH(Logtta_Temp)からのデータ
 */
export interface Logtta_TH_Data extends Logtta_TH_Connected_Data {
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
 * temperature and humidity data from Logtta_TH(Logtta_Temp)
 *
 * Logtta_TH(Logtta_Temp)からの音湿度データ
 */
export interface Logtta_TH_Connected_Data {
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
 * Logtta_TH(Logtta_Temp) management class
 *
 * Logtta_TH(Logtta_Temp)を管理するクラス
 */
export default class Logtta_TH extends Logtta<Logtta_TH_Data, Logtta_TH_Connected_Data> {
    static readonly PartsName = "Logtta_TH";
    static readonly AvailableBleMode: ObnizPartsBleMode[];
    static readonly LocalName: {
        Connectable: undefined;
        Beacon: RegExp;
    };
    static readonly ServiceUuids: {
        Connectable: string;
        Beacon: null;
    };
    static readonly BeaconDataStruct: ObnizPartsBleCompare<ObnizBleBeaconStruct<Logtta_TH_Data> | null>;
    protected static parseTemperatureData(data: number[], func?: (value: number[]) => number): number;
    protected static parseHumidityData(data: number[], func?: (value: number[]) => number): number;
    /**
     * @deprecated
     *
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
     * @deprecated
     *
     * Verify that the received advertisement is from the Logtta_TH(Logtta_Temp) (in Beacon Mode)
     *
     * 受け取ったAdvertisementがLogtta_TH(Logtta_Temp)のものかどうか確認する(ビーコンモード中)
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_TH(Logtta_Temp)
     *
     * Logtta_TH(Logtta_Temp)かどうか
     */
    static isAdvDevice(peripheral: BleRemotePeripheral): boolean;
    protected readonly staticClass: typeof Logtta_TH;
    /**
     * @deprecated
     *
     * Get all data with connected state
     *
     * 接続している状態で全てのデータを取得
     *
     * @returns all data from the Logtta_TH(Logtta_Temp)
     *
     * Logtta_TH(Logtta_Temp)から受け取った全てのデータ
     */
    getAllWait(): Promise<Logtta_TH_Connected_Data | null>;
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
    protected parseData(data: number[]): Logtta_TH_Connected_Data;
}
