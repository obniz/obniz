/**
 * @packageDocumentation
 * @module Parts.iBS01RG
 */
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";
export interface IBS01RGOptions {
}
export interface IBS01RG_Acceleration_Data {
    x: number;
    y: number;
    z: number;
}
export interface IBS01RG_Data {
    battery: number;
    active: boolean;
    button: boolean;
    acceleration: IBS01RG_Acceleration_Data[];
}
export default class IBS01RG implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static getData(peripheral: BleRemotePeripheral): IBS01RG_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
    constructor();
}
