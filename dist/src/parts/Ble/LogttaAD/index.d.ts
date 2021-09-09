/**
 * @packageDocumentation
 * @module Parts.Logtta_AD
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface Logtta_ADOptions {
}
/**
 * data from Logtta_AD
 *
 * Logtta_ADからの受け取ったデータ
 */
export interface Logtta_AD_Data {
    /**
     * 電流値 current value
     *
     * Range 範囲: 4~20 (Unit 単位: 1 mA)
     */
    ampere: number;
    /**
     * 電圧値 voltage value
     *
     * Range 範囲: 1~5 (Unit 単位: 1 mV)
     */
    volt: number;
    /** count data カウントデータ */
    count: number;
}
/** Logtta_AD management class Logtta_ADを管理するクラス */
export default class Logtta_AD implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the Logtta_AD
     *
     * 受け取ったPeripheralがLogtta_ADのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Logtta_AD
     *
     * Logtta_ADかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    private static get_uuid;
    onNotify?: (data: Logtta_AD_Data) => void;
    _peripheral: null | BleRemotePeripheral;
    ondisconnect?: (reason: any) => void;
    constructor(peripheral: BleRemotePeripheral | null);
    /**
     * Connect to the Logtta_AD
     *
     * Logtta_ADに接続
     */
    connectWait(): Promise<void>;
    /**
     * Disconnect from the Logtta_AD
     *
     * Logtta_ADとの接続を解除
     */
    disconnectWait(): Promise<void>;
    /**
     * Get all data available from the Logtta_AD
     *
     * Logtta_ADから取得可能なデータを全て取得
     *
     * @returns all data available from the Logtta_AD
     *
     * Logtta_ADから受け取った全てのデータ
     */
    getAllWait(): Promise<Logtta_AD_Data | null>;
    /**
     * Get the current value from the Logtta_AD
     *
     * Logtta_ADから電流値を取得
     *
     * @returns the current value from the Logtta_AD
     *
     * Logtta_ADから受け取った電流値
     */
    getAmpereWait(): Promise<number>;
    /**
     * Get the voltage value from the Logtta_AD
     *
     * Logtta_ADから電圧値を取得
     *
     * @returns the voltage value from the Logtta_AD
     *
     * Logtta_ADから受け取った電圧値
     */
    getVoltWait(): Promise<number>;
    /**
     * Get the count data from the Logtta_AD
     *
     * Logtta_ADからカウントデータを取得
     *
     * @returns the count data from the Logtta_AD
     *
     * Logtta_ADから受け取ったカウントデータ
     */
    getCountWait(): Promise<number>;
    /**
     * Notify when the data have got from the Logtta_AD
     *
     * Logtta_ADからデータを取得したとき通知
     *
     * @returns
     */
    startNotifyWait(): Promise<void>;
}
