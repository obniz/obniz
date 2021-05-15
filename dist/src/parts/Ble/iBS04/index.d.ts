/**
 * @packageDocumentation
 * @module Parts.iBS04
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface IBS04Options {
}
export interface IBS04_Data {
    battery: number;
    button: boolean;
}
export default class IBS04 implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static getData(peripheral: BleRemotePeripheral): IBS04_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
}
