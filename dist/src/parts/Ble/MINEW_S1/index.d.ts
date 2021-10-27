/**
 * @packageDocumentation
 * @module Parts.MINEW_S1_HT
 */
import Obniz from '../../../obniz';
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface from '../../../obniz/ObnizPartsBleInterface';
/**
 * temperature and humidity data from MINEW_S1 advertisement
 *
 * MINEW_S1のadvertisementからの温湿度データ
 */
export interface MINEW_S1_HTData {
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
export default class MINEW_S1 implements ObnizPartsBleInterface {
    static info(): {
        name: string;
    };
    /**
     * Verify that the received peripheral is from the MINEW_S1
     *
     * 受け取ったPeripheralがMINEW_S1のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @param macAddress (optional: If you want to specify a MAC address) MAC address
     *
     * (任意: MACアドレスを指定したい場合) MACアドレス
     *
     * @returns Whether it is the MINEW_S1
     *
     * MINEW_S1かどうか
     *
     * true: HT Sensor SLOT / Info SLOT
     *
     * false: iBeacon SLOT / UID SLOT / URL SLOT / TLM SLOT / other advertisements
     */
    static isDevice(peripheral: BleRemotePeripheral, macAddress?: string | null): boolean;
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
    static getHTData(peripheral: BleRemotePeripheral): null | MINEW_S1_HTData;
    private static _hasPrefix;
    _peripheral: null | BleRemotePeripheral;
    keys: string[];
    requiredKeys: string[];
    params: any;
    wired(obniz: Obniz): void;
}
