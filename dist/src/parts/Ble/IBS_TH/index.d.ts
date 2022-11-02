/**
 * @packageDocumentation
 * @module Parts.IBS_TH
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS_THOptions {
}
/**
 * advertisement data from IBS_TH
 *
 * IBS_THからのadvertisementデータ
 */
export interface IBS_TH_Data {
    /** battery */
    battery: number;
    /** temperature(℃) 気温(℃)  */
    temperature: number;
    /** humidity(%) 湿度(%)  */
    humidity: number;
}
/** IBS_TH management class IBS_THを管理するクラス */
export default class IBS_TH implements ObnizPartsBleInterface {
    _peripheral: BleRemotePeripheral | null;
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static getData(peripheral: BleRemotePeripheral): IBS_TH_Data | null;
    private static _deviceAdvAnalyzer;
}
