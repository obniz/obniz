/**
 * @packageDocumentation
 * @module Parts.iBS01T
 */
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";
export interface IBS01TOptions {
}
export interface IBS01T_Data {
    button: boolean;
    moving: boolean;
    reed: boolean;
    battery: number;
    temperature: number;
    humidity: number;
}
export default class IBS01T implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static getData(peripheral: BleRemotePeripheral): IBS01T_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
    constructor();
}
