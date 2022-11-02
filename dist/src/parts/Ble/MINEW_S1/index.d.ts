/**
 * @packageDocumentation
 * @module Parts.MINEW_S1
 */
import MINEW from '../utils/abstracts/MINEW';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleCompare, ObnizBleBeaconStruct, ObnizPartsBleMode } from '../../../obniz/ObnizPartsBleAbstract';
/**
 * temperature and humidity data from MINEW_S1 advertisement
 *
 * MINEW_S1のadvertisementからの温湿度データ
 */
export interface MINEW_S1_Data {
    frameType: number;
    versionNumber: number;
    batteryLevel: number;
    /**
     * temperature 温度
     *
     * Range 範囲: -40~70 (Unit 単位: 0.05 degC)
     */
    temperature: number;
    /**
     * relative humidity 湿度
     *
     * Range 範囲: 0~100 (Unit 単位: 0.05%RH)
     */
    humidity: number;
    /** MAC address MACアドレス */
    macAddress: string;
}
/**
 * device data from MINEW_S1 advertisement
 *
 * MINEW_S1のadvertisementからのデバイスデータ
 */
export interface MINEW_S1_InfoData {
    frameType: number;
    versionNumber: number;
    batteryLevel: number;
    /** MAC address MACアドレス */
    macAddress: string;
    name: string;
}
export interface MINEW_S1Options {
}
/** MINEW_S1 management class MINEW_S1を管理するクラス */
export default class MINEW_S1 extends MINEW<MINEW_S1_Data> {
    protected staticClass: typeof MINEW_S1;
    static readonly PartsName = "MINEW_S1";
    static readonly ServiceDataStruct: ObnizPartsBleCompare<ObnizBleBeaconStruct<MINEW_S1_Data>>;
    static isDeviceWithMode(peripheral: BleRemotePeripheral, mode: ObnizPartsBleMode): boolean;
    /**
     * Get device information data from the MINEW_S1
     *
     * MINEW_S1からのデバイス情報データを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received device information data from the MINEW_S1
     *
     * MINEW_S1から受け取ったデバイス情報データ
     */
    static getInfoData(peripheral: BleRemotePeripheral): null | MINEW_S1_InfoData;
    /**
     * @deprecated
     * Use MINEW_S1.getData();
     *
     * Get temperature and humidity data from the MINEW_S1
     *
     * MINEW_S1からの温湿度データを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received temperature and humidity data from the MINEW_S1
     *
     * MINEW_S1から受け取った温湿度データ
     */
    static getHTData(peripheral: BleRemotePeripheral): null | MINEW_S1_Data;
}
