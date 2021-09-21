/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS03ROptions {
}
export interface IBS03R_Data {
    battery: number;
    button: boolean;
    distance: number;
    address: string;
}
export default class IBS03R implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static getData(peripheral: BleRemotePeripheral): IBS03R_Data | null;
    private static deviceAdv;
    private static getDeviceArray;
    _peripheral: BleRemotePeripheral | null;
}
