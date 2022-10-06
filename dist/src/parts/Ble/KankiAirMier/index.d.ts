/**
 * @packageDocumentation
 * @module Parts.KankiAirMier
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface KankiAirMierOptions {
}
/**
 * advertisement data from Kanki AirMier
 *
 * 換気エアミエルからのadvertisementデータ
 */
export interface KankiAirMier_Data {
    /**
     * CO2 concentration CO2濃度
     *
     * Range 範囲: 0~10000 (Unit 単位: 1 ppm)
     */
    co2: number;
    /** temperature 温度 (Unit 単位: 0.1 degC) */
    temperature: number;
    /** relative humidity 相対湿度 (Unit 単位: 0.1 %RH) */
    humidity: number;
    /**
     * sequence number (count up each time remeasuring)
     *
     * シーケンス番号 (再計測のたびにカウントアップする)
     *
     * Range 範囲: 1~7
     *
     * 0 at startup, repeat 1~7 thereafter
     *
     * 起動時0、それ以降1~7を繰り返す
     */
    sequenceNumber: number;
    /** device name デバイス名 */
    deviceName: string;
}
/** Kanki AirMier management class 換気エアミエルを管理するクラス */
export default class KankiAirMier implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the Kanki AirMier
     *
     * 受け取ったPeripheralが換気エアミエルのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Kanki AirMier
     *
     * 換気エアミエルかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the Kanki AirMier
     *
     * 換気エアミエルからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the Kanki AirMier 換気エアミエルから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): KankiAirMier_Data | null;
    private static _deviceAdvAnalyzer;
    _peripheral: BleRemotePeripheral | null;
}
