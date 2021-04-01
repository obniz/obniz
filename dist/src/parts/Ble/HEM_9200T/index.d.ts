/**
 * @packageDocumentation
 * @module Parts.HEM-9200T
 */
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface from "../../../obniz/ObnizPartsBleInterface";
import { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export declare type HEM_9200TMesurementStatus = "BodyMovementDetection" | "CuffFitDetection" | "IrregularPulseDetection" | "PulseRateRangeDetection" | "MeasurementPositionDetection";
export interface HEM_9200TResult {
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
    measurementStatus?: HEM_9200TMesurementStatus[];
}
export interface HEM_9200TOptions {
    timezoneOffsetMinute?: number;
    passkey?: number;
}
export default class HEM_9200T implements ObnizPartsBleInterface {
    static info(): ObnizPartsInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    keys: string[];
    requiredKeys: string[];
    params: any;
    _peripheral: BleRemotePeripheral | null;
    private _timezoneOffsetMinute;
    private _passkey;
    constructor(peripheral: BleRemotePeripheral | null, options?: HEM_9200TOptions);
    getDataWait(): Promise<HEM_9200TResult[]>;
    subscribeWait(service: string, char: string, callback?: any): Promise<void>;
    private _analyzeData;
    private _readSFloat;
}
