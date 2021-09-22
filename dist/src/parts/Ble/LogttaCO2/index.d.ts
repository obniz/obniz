/**
 * @packageDocumentation
 * @module Parts.Logtta_CO2
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizBleBeaconStruct, ObnizPartsBleCompare } from '../../../obniz/ObnizPartsBleAbstract';
import Logtta from '../utils/abstracts/Logtta';
export interface Logtta_CO2Options {
}
export interface Logtta_CO2_Data extends Logtta_CO2_Connected_Data {
    battery: number;
    interval: number;
    address: string;
}
export interface Logtta_CO2_Connected_Data {
    co2: number;
}
export default class Logtta_CO2 extends Logtta<Logtta_CO2_Data, Logtta_CO2_Connected_Data> {
    static readonly PartsName = "Logtta_CO2";
    static readonly ServiceUuids: {
        Connectable: string;
        Beacon: null;
    };
    static readonly BeaconDataStruct: ObnizPartsBleCompare<ObnizBleBeaconStruct<Logtta_CO2_Data> | null>;
    /** @deprecated */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /** @deprecated */
    static isAdvDevice(peripheral: BleRemotePeripheral): boolean;
    protected readonly staticClass: typeof Logtta_CO2;
    protected callbackFlag: boolean;
    startNotifyWait(callback: (data: Logtta_CO2_Connected_Data) => void): Promise<void>;
    /** @deprecated */
    getWait(): Promise<number | null>;
    /** @deprecated */
    setBeaconMode(enable: boolean): Promise<boolean>;
    protected parseData(data: number[]): Logtta_CO2_Connected_Data;
}
