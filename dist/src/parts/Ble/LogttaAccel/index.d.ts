/**
 * @packageDocumentation
 * @module Parts.Logtta_Accel
 */
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";
export interface Logtta_AccelOptions {
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
export default class Logtta_Accel implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    static getScanData(peripheral: BleRemotePeripheral): Logtta_Accel_ScanData | null;
    static getAccelData(peripheral: BleRemotePeripheral): Logtta_Accel_AccelData | null;
    private static deviceAdv;
    _peripheral: BleRemotePeripheral | null;
    constructor();
}
