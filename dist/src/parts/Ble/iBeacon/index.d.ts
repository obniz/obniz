/**
 * @packageDocumentation
 * @module Parts.iBeacon
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface iBeaconOptions {
}
/**
 * advertisement data from iBeacon
 *
 * iBeaconからのadvertisementデータ
 */
export interface iBeacon_Data {
    uuid: string;
    major: number;
    minor: number;
    power: number;
}
/** iBeacon management class iBeacon管理クラス */
export default class iBeacon implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is iBeacon
     *
     * 受け取ったPeripheralがiBeaconのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the iBeacon
     *
     * iBeaconかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the iBeacon
     *
     * iBeaconからデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the iBeacon
     */
    static getData(peripheral: BleRemotePeripheral): iBeacon_Data | null;
    _peripheral: BleRemotePeripheral | null;
}
