/**
 * @packageDocumentation
 * @module Parts.EXTxx
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface from '../../../obniz/ObnizPartsBleInterface';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface EXTxx_Options {
}
export declare type EXTxx_Type = 'wBeacon' | 'BatteryLevelNotification';
export interface EXTxx_Data {
    uuid: string;
    major: number;
    minor: number;
    power: number;
    battery: number;
}
export default class EXTxx extends ObnizPartsBleInterface {
    static info(): ObnizPartsInfo;
    static readonly PartsName = "EXTxx";
    static readonly AvailableBleMode = "Beacon";
    protected static DefaultAdvData: number[];
    getData(): EXTxx_Data;
    static getData(peripheral: BleRemotePeripheral): EXTxx_Data | null;
    constructor(peripheral: BleRemotePeripheral);
    static isDevice(peripheral: BleRemotePeripheral): boolean;
}
