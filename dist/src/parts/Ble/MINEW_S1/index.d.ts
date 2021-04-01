/**
 * @packageDocumentation
 * @module Parts.MINEW_S1_HT
 */
import Obniz from "../../../obniz";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface from "../../../obniz/ObnizPartsBleInterface";
export interface MINEW_S1_HTData {
    frameType: number;
    versionNumber: number;
    batteryLevel: number;
    temperature: number;
    humidity: number;
    macAddress: string;
}
export interface MINEW_S1_InfoData {
    frameType: number;
    versionNumber: number;
    batteryLevel: number;
    macAddress: string;
    name: string;
}
export interface MINEW_S1Options {
}
export default class MINEW_S1 implements ObnizPartsBleInterface {
    static info(): {
        name: string;
    };
    static isDevice(peripheral: BleRemotePeripheral, macAddress?: string | null): boolean;
    static getInfoData(peripheral: BleRemotePeripheral): null | MINEW_S1_InfoData;
    static getHTData(peripheral: BleRemotePeripheral): null | MINEW_S1_HTData;
    private static _hasPrefix;
    _peripheral: null | BleRemotePeripheral;
    keys: string[];
    requiredKeys: string[];
    params: any;
    wired(obniz: Obniz): void;
}
