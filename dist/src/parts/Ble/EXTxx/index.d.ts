/**
 * @packageDocumentation
 * @module Parts.EXTxx
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface } from '../../../obniz/ObnizPartsBleInterface';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface EXTxx_Options {
}
export declare type EXTxx_Type = 'wBeacon' | 'BatteryLevelNotification';
/**
 * advertisement data from EXTxx
 *
 * EXTxxからのadvertisementデータ
 */
export interface EXTxx_Data {
    /** iBeacon uuid */
    uuid: string;
    /** iBeacon major */
    major: number;
    /** iBeacon minor */
    minor: number;
    /** iBeacon power */
    power: number;
    /** remaining battery 電池残量 */
    battery: number;
}
/** EXTxx management class EXTxxを管理するクラス */
export default class EXTxx extends ObnizPartsBleInterface {
    static info(): ObnizPartsInfo;
    static readonly PartsName = "EXTxx";
    static readonly AvailableBleMode = "Beacon";
    protected static DefaultAdvData: number[];
    /**
     * (with instantiation) Get a data from the beacon
     *
     * (インスタンス化する場合) ビーコンからデータを取得
     *
     * @returns received data from the beacon ビーコンから受け取ったデータ
     */
    getData(): EXTxx_Data;
    /**
     * (without instantiation) Get a data from the beacon
     *
     * (インスタンス化しない場合) ビーコンからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the beacon ビーコンから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): EXTxx_Data | null;
    constructor(peripheral: BleRemotePeripheral);
    /**
     * Verify that the received peripheral is from the EXTxx
     *
     * 受け取ったperipheralがEXTxxのものかどうか確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the EXTxx
     *
     * EXTxxかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
}
