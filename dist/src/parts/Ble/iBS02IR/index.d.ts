/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";
export interface IBS02IROptions {
}
export interface IBS02IR_Data {
    event: boolean;
    battery: number;
}
export default class IBS02IR implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static getData(peripheral: BleRemotePeripheral): IBS02IR_Data | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
    constructor();
}
