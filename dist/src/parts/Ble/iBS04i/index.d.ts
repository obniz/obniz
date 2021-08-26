/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS04IOptions {
}
/**
 * advertisement data from IBS04i
 *
 * IBS04iからのadvertisementデータ
 */
export interface IBS04I_Data {
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /**
     * button state ボタンの状態
     *
     * true: pressed 押された状態 / false: not pressed 押されていない状態
     */
    button: boolean;
    /** iBeacon UUID */
    uuid: string;
    /** iBeacon major */
    major: number;
    /** iBeacon minor */
    minor: number;
    /** iBeacon power */
    power: number;
    /**
     * RSSI(Received Signal Strength Indicator) 電波強度 (Unit 単位: dBm) */
    rssi: number;
    /** BLE address BLEのアドレス */
    address: string;
}
/** iBS04i management class iBS04iを管理するクラス */
export default class IBS04I implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the iBS04i
     *
     * 受け取ったPeripheralがiBS04iのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBS04i
     *
     * iBS04iかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the iBS04i
     *
     * iBS04iからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBS04i iBS04iから受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): IBS04I_Data | null;
    private static deviceAdv;
    private static getDeviceArray;
    _peripheral: BleRemotePeripheral | null;
}
