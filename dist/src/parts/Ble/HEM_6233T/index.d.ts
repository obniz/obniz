/**
 * @packageDocumentation
 * @module Parts.HEM_6233T
 */
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface from "../../../obniz/ObnizPartsBleInterface";
import { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface HEM_6233TOptions {
}
export declare type HEM_6233TMesurementStatus = "BodyMovementDetection" | "CuffFitDetection" | "IrregularPulseDetection" | "PulseRateRangeDetection" | "MeasurementPositionDetection";
export interface HEM_6233TResult {
    bloodPressure?: {
        systolic: number;
        diastolic: number;
        meanArterialPressure: number;
        unit: "mmHg";
    };
    date?: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
    };
    pulseRate?: number;
    userId?: number;
    measurementStatus?: HEM_6233TMesurementStatus[];
}
export default class HEM_6233T implements ObnizPartsBleInterface {
    static info(): ObnizPartsInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    keys: string[];
    requiredKeys: string[];
    params: any;
    _peripheral: BleRemotePeripheral | null;
    private _timezoneOffsetMinute;
    constructor(peripheral: BleRemotePeripheral | null, timezoneOffsetMinute: number);
    getDataWait(pairingKeys?: string): Promise<HEM_6233TResult[]>;
    subscribeWait(service: string, char: string, callback?: any): Promise<void>;
    _writeTimeCharWait(timeOffsetMinute: number): Promise<void>;
    private _readFloatLE;
    private _readSFloatLE;
    private _analyzeData;
}
