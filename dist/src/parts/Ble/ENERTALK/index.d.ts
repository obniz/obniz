/**
 * @packageDocumentation
 * @module Parts.ENERTALK_TOUCH
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface } from '../../../obniz/ObnizPartsBleInterface';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import { BleBatteryService } from '../utils/services/batteryService';
export interface ENERTALK_TOUCHOptions {
}
/** ENERTALK TOUCH management class ENERTALK TOUCHを管理するクラス */
export default class ENERTALK_TOUCH implements ObnizPartsBleInterface {
    static info(): ObnizPartsInfo;
    /**
     * Verify that the received peripheral is from the ENERTALK TOUCH
     *
     * 受け取ったperipheralがENERTALK TOUCHのものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the ENERTALK TOUCH
     *
     * ENERTALK TOUCHかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    keys: string[];
    requiredKeys: string[];
    params: any;
    _peripheral: BleRemotePeripheral | null;
    ondisconnect?: (reason: any) => void;
    batteryService?: BleBatteryService;
    private _uuids;
    private _service;
    private _temperatureChar;
    private _humidityChar;
    private _illuminanceChar;
    private _accelerometerChar;
    constructor(peripheral: BleRemotePeripheral | null);
    /**
     * Connect the sensor
     *
     * Throw an error if the device is not found
     *
     * センサへ接続
     *
     * デバイスが見つからなかった場合はエラーをthrow
     */
    connectWait(): Promise<void>;
    /**
     * Disconnect from the sensor
     *
     * センサから切断
     */
    disconnectWait(): Promise<void>;
    /**
     * Get the temperature data from the sensor
     *
     * センサから温度データを取得
     *
     * @returns temperature value 温度の値
     *
     * Range 範囲: -1000~5000
     *
     * (Unit 単位: 0.01 degC)
     */
    getTemperatureWait(): Promise<number>;
    /**
     * Get the humidity data from the sensor
     *
     * センサから湿度データを取得
     *
     * @returns humidity value 湿度の値
     *
     * Range 範囲: 0~100
     *
     * (Unit 単位: 1 %RH)
     */
    getHumidityWait(): Promise<number>;
    /**
     * Get the illumination data from the sensor
     *
     * センサから照度データを取得
     *
     * @returns illumination value 照度の値
     *
     * Range 範囲: 0~65535
     *
     * (Unit 単位: 1 lx)
     */
    getIlluminationWait(): Promise<number>;
    /**
     * Get the acceleration data from the sensor
     *
     * センサから加速度データを取得
     *
     * @returns acceleration values 加速度の値
     *
     * Range 範囲: -2000~2000
     *
     * (Unit 単位: 1 mg)
     */
    getAccelerometerWait(): Promise<{
        x: number;
        y: number;
        z: number;
    }>;
}
