/**
 * @packageDocumentation
 * @module Parts.iBS01G
 */
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";
export interface IBS01GOptions {
}
export interface IBS01G_Data {
    battery: number;
    button: boolean;
    moving: boolean;
    fall: boolean;
}
export default class IBS01G implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static getData(peripheral: BleRemotePeripheral): IBS01G_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
    constructor();
}
