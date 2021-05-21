/**
 * @packageDocumentation
 * @module Parts.TR4
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface Tr4Options {
}
export interface Tr4_Data {
    temperature: number;
}
export default class Tr4 implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static getData(peripheral: BleRemotePeripheral): Tr4_Data | null;
    private static _deviceAdvAnalyzer;
    _peripheral: BleRemotePeripheral | null;
    constructor();
}
