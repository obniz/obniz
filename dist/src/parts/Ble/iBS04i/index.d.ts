/**
 * @packageDocumentation
 * @module Parts.iBS04i
 */
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";
export interface IBS04IOptions {
}
export interface IBS04I_Data {
    battery: number;
    button: boolean;
    uuid: string;
    major: number;
    minor: number;
    power: number;
    rssi: number;
    address: string;
}
export default class IBS04I implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static getData(peripheral: BleRemotePeripheral): IBS04I_Data | null;
    private static deviceAdv;
    private static getDeviceArray;
    _peripheral: BleRemotePeripheral | null;
    constructor();
}
