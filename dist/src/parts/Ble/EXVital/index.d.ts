/**
 * @packageDocumentation
 * @module Parts.EXVital
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface from '../../../obniz/ObnizPartsBleInterface';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface EXVital_Options {
}
export interface EXVital_Data {
    major: number;
    minor: number;
    power: number;
    diastolic_pressure: number;
    systolic_pressure: number;
    arm_temp: number;
    body_temp: number;
    heart_rate: number;
    battery: number;
    steps: number;
}
/** EXVital management class EXVitalを管理するクラス */
export default class EXVital extends ObnizPartsBleInterface {
    static info(): ObnizPartsInfo;
    static readonly partsName = "EXVital";
    static readonly availableBleMode = "Beacon";
    protected advData: number[] | undefined;
    protected static DefaultAdvData: number[];
    /**
     * (with instantiation) Get a data from the beacon
     *
     * (インスタンス化する場合) ビーコンからデータを取得
     *
     * @returns received data from the beacon ビーコンから受け取ったデータ
     *
     * `contents 中身`
     * - major: iBeacon major
     * - minor: iBeacon minor
     * - power: iBeacon power
     * - diastolic_pressure: diastolic pressure 最低血圧
     * - systolic_pressure: systolic pressure 最高血圧
     * - arm_temp: arm temp 腕温度
     * - body_temp: body temp 体温
     * - heart_rate: heart rate 心拍数
     * - battery: battery voltage バッテリー電圧
     * - steps: number of steps 歩数
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
     *
     * `contents 中身`
     * - major: iBeacon major
     * - minor: iBeacon minor
     * - power: iBeacon power
     * - diastolic_pressure: diastolic pressure 最低血圧
     * - systolic_pressure: systolic pressure 最高血圧
     * - arm_temp: arm temp 腕温度
     * - body_temp: body temp 体温
     * - heart_rate: heart rate 心拍数
     * - battery: battery voltage バッテリー電圧
     * - steps: number of steps 歩数
     */
    static getData(peripheral: BleRemotePeripheral): EXVital_Data | null;
    constructor(peripheral: BleRemotePeripheral);
    /**
     * verify that the received peripheral is from the EXVital
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
