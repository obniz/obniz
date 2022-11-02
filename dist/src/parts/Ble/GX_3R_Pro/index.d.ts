/// <reference types="node" />
/// <reference types="node" />
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface } from '../../../obniz/ObnizPartsBleInterface';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface GX_3R_Pro_Options {
}
/**
 * advertisement data from EXVital
 *
 * EXTVitalからのadvertisementデータ
 */
export interface GX_3R_Pro_Data {
    /** iBeacon major */
    major: number;
    /** iBeacon minor */
    minor: number;
    /** iBeacon power */
    power: number;
    /**
     * diastolic pressure 最低血圧
     *
     * Range 範囲: 75~160
     *
     * (Unit 単位: 1 mmHg)
     */
    diastolic_pressure: number;
    /**
     * systolic pressure 最高血圧
     *
     * Range 範囲: 75-160
     *
     * (Unit 単位: 1 mmHg)
     *
     */
    systolic_pressure: number;
    /**
     * arm temp 腕温度
     *
     * Range 範囲: 26~40
     *
     * (Unit 単位: 0.1 degC)
     */
    arm_temp: number;
    /**
     * body temp 体温
     *
     * Range 範囲: 33~38
     *
     * (Unit 単位: 0.1 degC)
     */
    body_temp: number;
    /**
     * heart rate 心拍数
     *
     * Range 範囲: 45~225
     *
     * (Unit 単位: 1 bpm)
     */
    heart_rate: number;
    /**
     * battery voltage バッテリー電圧
     *
     * Range 範囲: 3.2~4.2
     *
     * (Unit 単位: V)
     */
    battery: number;
    /**
     * number of steps 歩数
     *
     * Range 範囲: 0~65535
     *
     * (Unit 単位: 1 step 1 歩)
     */
    steps: number;
}
/** GX_3R_Pro management class GX_3R_Proを管理するクラス */
export default class GX_3R_Pro extends ObnizPartsBleInterface {
    static info(): ObnizPartsInfo;
    _peripheral: BleRemotePeripheral;
    static readonly partsName = "GX_3R_Pro";
    static readonly availableBleMode = "Connectable";
    private code;
    private event;
    private serialExecutor;
    private gasCharRx?;
    private gasCharTx?;
    private settingCharRx?;
    private settingCharTx?;
    constructor(peripheral: BleRemotePeripheral);
    /**
     * Verify that the received peripheral is from the GX_3R_Pro
     *
     * 受け取ったperipheralがGX_3R_Proのものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the GX_3R_Pro
     *
     * GX_3R_Proかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    connectWait(): Promise<void>;
    sendCommandWait(command: string, subCommand: string, data: number[]): Promise<{
        address: string;
        channel: string;
        command: string;
        subCommand: string;
        data: any;
        dataString: string;
    } | null>;
    calcChecksum(buf: number[]): Buffer;
    parseCommand(data: number[]): {
        address: string;
        channel: string;
        command: string;
        subCommand: string;
        data: any;
        dataString: string;
    } | null;
    private getGasSettingsWait;
    getDataWait(): Promise<GX_3R_Pro_Data | null>;
}
