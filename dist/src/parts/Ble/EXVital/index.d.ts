/**
 * @packageDocumentation
 * @module Parts.EXVital
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface } from '../../../obniz/ObnizPartsBleInterface';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface EXVital_Options {
}
/**
 * advertisement data from EXVital
 *
 * EXTVitalからのadvertisementデータ
 */
export interface EXVital_Data {
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
/** EXVital management class EXVitalを管理するクラス */
export default class EXVital extends ObnizPartsBleInterface {
    static info(): ObnizPartsInfo;
    static readonly partsName = "EXVital";
    static readonly availableBleMode = "Beacon";
    protected static DefaultAdvData: number[];
    /**
     * (with instantiation) Get a data from the beacon
     *
     * (インスタンス化する場合) ビーコンからデータを取得
     *
     * @returns received data from the beacon ビーコンから受け取ったデータ
     */
    getData(): EXVital_Data;
    /**
     * (without instantiation) Get a data from the beacon
     *
     * (インスタンス化しない場合) ビーコンからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the beacon ビーコンから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): EXVital_Data | null;
    constructor(peripheral: BleRemotePeripheral);
    /**
     * Verify that the received peripheral is from the EXVital
     *
     * 受け取ったperipheralがEXVitalのものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the EXVital
     *
     * EXVitalかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
}
