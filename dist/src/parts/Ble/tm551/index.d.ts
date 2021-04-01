/**
 * @packageDocumentation
 * @module Parts.TM551
 */
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";
export interface TM551Options {
}
export interface TM551_Data {
    battery: number;
    x: number;
    y: number;
    z: number;
}
export default class TM551 implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static getData(peripheral: BleRemotePeripheral): TM551_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
    constructor();
}
