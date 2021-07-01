/**
 * @packageDocumentation
 * @module Parts.Logtta_AD
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizBleBeaconStruct, ObnizPartsBleCompare } from '../../../obniz/ObnizPartsBleAbstract';
import Logtta from '../utils/abstracts/Logtta';
export interface Logtta_ADOptions {
}
export interface Logtta_AD_Data extends Logtta_AD_Connected_Data {
    battery: number;
    interval: number;
}
export interface Logtta_AD_Connected_Data {
    ampere: number;
    volt: number;
    count: number;
}
export default class Logtta_AD extends Logtta<Logtta_AD_Data, Logtta_AD_Connected_Data> {
    static readonly PartsName = "Logtta_AD";
    static readonly ServiceUuids: {
        Connectable: string;
        Beacon: null;
    };
    static readonly BeaconDataStruct: ObnizPartsBleCompare<ObnizBleBeaconStruct<Logtta_AD_Data> | null>;
    /** @deprecated */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    protected static parseAmpereData(data: number[], func?: (value: number[]) => number): number;
    protected static parseVoltData(data: number[], func?: (value: number[]) => number): number;
    protected readonly staticClass: typeof Logtta_AD;
    getAmpereWait(): Promise<number>;
    getVoltWait(): Promise<number>;
    getCountWait(): Promise<number>;
    /** @deprecated */
    getAllWait(): Promise<Logtta_AD_Connected_Data | null>;
    protected parseData(data: number[]): Logtta_AD_Connected_Data;
}
