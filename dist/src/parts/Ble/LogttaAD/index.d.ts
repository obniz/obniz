/**
 * @packageDocumentation
 * @module Parts.Logtta_AD
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizBleBeaconStruct, ObnizPartsBleCompare } from '../../../obniz/ObnizPartsBleAbstract';
import Logtta from '../utils/abstracts/Logtta';
export interface Logtta_ADOptions {
}
/**
 * data from Logtta_AD
 *
 * Logtta_ADからの受け取ったデータ
 */
export interface Logtta_AD_Data extends Logtta_AD_Connected_Data {
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
}
/**
 * the current value and voltage value data from Logtta_AD
 *
 * Logtta_ADからの電流電圧受け取ったデータ
 */
export interface Logtta_AD_Connected_Data {
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
export default class Logtta_AD extends Logtta<Logtta_AD_Data, Logtta_AD_Connected_Data> {
    static readonly PartsName = "Logtta_AD";
    static readonly ServiceUuids: {
        Connectable: string;
        Beacon: null;
    };
    static readonly BeaconDataStruct: ObnizPartsBleCompare<ObnizBleBeaconStruct<Logtta_AD_Data> | null>;
    /**
     * @deprecated
     *
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
    protected static parseAmpereData(data: number[], func?: (value: number[]) => number): number;
    protected static parseVoltData(data: number[], func?: (value: number[]) => number): number;
    protected readonly staticClass: typeof Logtta_AD;
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
     * @deprecated
     *
     * Get all data available from the Logtta_AD
     *
     * Logtta_ADから取得可能なデータを全て取得
     *
     * @returns all data available from the Logtta_AD
     *
     * Logtta_ADから受け取った全てのデータ
     */
    getAllWait(): Promise<Logtta_AD_Connected_Data | null>;
    protected parseData(data: number[]): Logtta_AD_Connected_Data;
}
