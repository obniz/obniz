/**
 * @packageDocumentation
 * @module Parts.Logtta_TH
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizBleBeaconStruct, ObnizPartsBleCompare, ObnizPartsBleMode } from '../../../obniz/ObnizPartsBleAbstract';
import Logtta from '../utils/abstracts/Logtta';
export interface Logtta_THOptions {
}
export interface Logtta_TH_Data extends Logtta_TH_Connected_Data {
    battery: number;
    interval: number;
    address: string;
}
export interface Logtta_TH_Connected_Data {
    temperature: number;
    humidity: number;
}
export default class Logtta_TH extends Logtta<Logtta_TH_Data, Logtta_TH_Connected_Data> {
    static readonly PartsName = "Logtta_TH";
    static readonly AvailableBleMode: ObnizPartsBleMode[];
    static readonly LocalName: {
        Connectable: undefined;
        Beacon: RegExp;
    };
    static readonly ServiceUuids: {
        Connectable: string;
        Beacon: null;
    };
    static readonly BeaconDataStruct: ObnizPartsBleCompare<ObnizBleBeaconStruct<Logtta_TH_Data> | null>;
    protected static parseTemperatureData(data: number[], func?: (value: number[]) => number): number;
    protected static parseHumidityData(data: number[], func?: (value: number[]) => number): number;
    /** @deprecated */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /** @deprecated */
    static isAdvDevice(peripheral: BleRemotePeripheral): boolean;
    protected readonly staticClass: typeof Logtta_TH;
    /** @deprecated */
    getAllWait(): Promise<Logtta_TH_Connected_Data | null>;
    getTemperatureWait(): Promise<number>;
    getHumidityWait(): Promise<number>;
    /** @deprecated */
    setBeaconMode(enable: boolean): Promise<boolean>;
    protected parseData(data: number[]): Logtta_TH_Connected_Data;
}
