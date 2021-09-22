/**
 * @packageDocumentation
 * @module Parts.Logtta_Accel
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { Triaxial } from '../../../obniz/ObnizParts';
import { ObnizBleBeaconStruct, ObnizPartsBleCompare } from '../../../obniz/ObnizPartsBleAbstract';
import Logtta from '../utils/abstracts/Logtta';
export interface Logtta_AccelOptions {
}
export interface Logtta_Accel_Data {
    revision: number;
    sequence: number;
    battery: number;
    name: string;
    setting: {
        temp_cycle: number;
        accel_sampling: number;
        hpf: boolean;
        accel_range: number;
        accel_axis: Logtta_Accel_Axis;
        accel_resolution: number;
    };
    temperature: number;
    humidity: number;
    alert: number[];
    accel_peak: Triaxial;
    accel_rms: Triaxial;
}
export interface Logtta_Accel_ScanData {
    revision: number;
    sequence: number;
    battery: number;
    name: string;
    setting: {
        temp_cycle: number;
        accel_sampling: number;
        hpf: boolean;
        accel_range: number;
        accel_axis: number;
        accel_resolution: number;
    };
    temperature: number;
    humidity: number;
    alert: number[];
}
export interface Logtta_Accel_AccelData {
    x: {
        peak: number;
        rms: number;
    };
    y: {
        peak: number;
        rms: number;
    };
    z: {
        peak: number;
        rms: number;
    };
}
export declare type Logtta_Accel_Axis = (keyof Triaxial)[];
/** Only support in beacon mode */
export default class Logtta_Accel extends Logtta<Logtta_Accel_Data, unknown> {
    static readonly PartsName = "Logtta_Accel";
    static readonly AvailableBleMode = "Beacon";
    static readonly ServiceUuids: {
        Connectable: string;
        Beacon: null;
    };
    static readonly BeaconDataLength: {
        Connectable: undefined;
        Beacon: number;
    };
    static readonly BeaconDataLength_ScanResponse: {
        Connectable: undefined;
        Beacon: number;
    };
    static readonly CompanyID: {
        Connectable: undefined;
        Beacon: number[];
    };
    static readonly CompanyID_ScanResponse: {
        Connectable: undefined;
        Beacon: number[];
    };
    static readonly BeaconDataStruct: ObnizPartsBleCompare<ObnizBleBeaconStruct<Logtta_Accel_Data> | null>;
    protected static parseAccelSamplingData(data: number): number;
    protected static parseAccelRangeData(data: number): number;
    protected static parseAccelAxis(data: number): Logtta_Accel_Axis;
    protected readonly staticClass: typeof Logtta_Accel;
    protected parseData(data: number[]): unknown;
    /** @deprecated */
    static getScanData(peripheral: BleRemotePeripheral): Logtta_Accel_ScanData | null;
    /** @deprecated */
    static getAccelData(peripheral: BleRemotePeripheral): Logtta_Accel_AccelData | null;
}
