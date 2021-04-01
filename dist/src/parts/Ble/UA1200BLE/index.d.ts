/**
 * @packageDocumentation
 * @module Parts.UA1200BLE
 */
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";
import BleBatteryService from "../abstract/services/batteryService";
import BleGenericAccess from "../abstract/services/genericAccess";
export interface UA1200BLEOptions {
}
export interface UA1200BLEResult {
    SystolicPressure_mmHg?: number;
    DiastolicPressure_mmHg?: number;
    MeanArterialPressure_mmHg?: number;
    SystolicPressure_kPa?: number;
    DiastolicPressure_kPa?: number;
    MeanArterialPressure_kPa?: number;
    date?: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
    };
    PulseRate?: number;
}
export default class UA1200BLE implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean | "" | null;
    static isCooperationMode(peripheral: BleRemotePeripheral): boolean;
    onNotify?: (co2: number) => void;
    _peripheral: BleRemotePeripheral | null;
    ondisconnect?: (reason: any) => void;
    genericAccess?: BleGenericAccess;
    batteryService?: BleBatteryService;
    _modeFlag?: boolean;
    private _timezoneOffsetMinute;
    constructor(peripheral: BleRemotePeripheral | null, timezoneOffsetMinute: number);
    pairingWait(): Promise<string | null>;
    getDataWait(): Promise<UA1200BLEResult[]>;
    private _readFLOAT_LE;
    private _readSFLOAT_LE;
    private _analyzeData;
    private _getCharsCoopMode;
    private _getCharsSingleMode;
    private _writeTimeChar;
}
