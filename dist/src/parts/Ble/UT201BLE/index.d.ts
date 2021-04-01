/**
 * @packageDocumentation
 * @module Parts.UT201BLE
 */
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";
import BleBatteryService from "../abstract/services/batteryService";
import BleGenericAccess from "../abstract/services/genericAccess";
export interface UT201BLEOptions {
}
export interface UT201BLEResult {
    fahrenheit?: number;
    celsius?: number;
    date?: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
    };
    temperatureType?: string;
}
export default class UT201BLE implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean | "" | null;
    onNotify?: (co2: number) => void;
    _peripheral: BleRemotePeripheral | null;
    ondisconnect?: (reason: any) => void;
    genericAccess?: BleGenericAccess;
    batteryService?: BleBatteryService;
    private _timezoneOffsetMinute;
    constructor(peripheral: BleRemotePeripheral | null, timezoneOffsetMinute: number);
    pairingWait(): Promise<string | null>;
    getDataWait(pairingKeys?: string): Promise<UT201BLEResult[]>;
    private _readFloatLE;
    private _analyzeData;
    private _getChars;
    private _writeTimeChar;
}
