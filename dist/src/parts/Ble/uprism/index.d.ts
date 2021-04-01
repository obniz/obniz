/**
 * @packageDocumentation
 * @module Parts.uPRISM
 */
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";
export interface uPRISMOptions {
}
export declare type AccelRangeType = "2g" | "4g" | "8g" | "16g";
export interface uPRISM_Data {
    acceleration: {
        x: number;
        y: number;
        z: number;
    };
    geomagnetic: {
        x: number;
        y: number;
        z: number;
    };
    time: {
        year: number;
        month: number;
        day: number;
        hour: number;
        minute: number;
        second: number;
        micro_second: number;
    };
    index: number;
    temperature: number;
    humidity: number;
    ambient_light: number;
    uvi: number;
    pressure: number;
}
export default class uPRISM implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    _peripheral: null | BleRemotePeripheral;
    ondisconnect?: (reason: any) => void;
    onNotify?: (data: uPRISM_Data) => void;
    private readData;
    private readIndex;
    private accelRange;
    private _uuids;
    constructor(peripheral: BleRemotePeripheral | null);
    connectWait(): Promise<void>;
    disconnectWait(): Promise<void>;
    setAccelRange(range: AccelRangeType): void;
    startNotifyWait(): Promise<void>;
    stopNotifyWait(): Promise<void>;
}
