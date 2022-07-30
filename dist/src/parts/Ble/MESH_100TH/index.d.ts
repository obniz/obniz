/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
import { MESH } from '../utils/abstracts/MESH';
export interface MESH_100THOptions {
}
/**
 * advertisement data from MESH_100TH
 */
export interface MESH_100TH_Data {
    name: string;
    address: string;
}
/** MESH_100TH management class */
export default class MESH_100TH extends MESH<MESH_100TH_Data> {
    static readonly PartsName = "MESH_100TH";
    static readonly PREFIX = "MESH-100TH";
    static readonly NotifyType: {
        readonly UPDATE_TEMPERATURE: 4;
        readonly UPDATE_HUMIDITY: 8;
        readonly ONCE: 16;
        readonly ALWAYS: 32;
    };
    onSensorEvent: ((temperature: number, humidity: number) => void) | null;
    protected readonly staticClass: typeof MESH_100TH;
    getDataWait(): Promise<{
        name: string;
        address: string;
    }>;
    setMode(temperatureUpper: number, temperatureBottom: number, temperatureCondition: number, humidityUpper: number, humidityBottom: number, humidityCondision: number, type: number, opt_requestId?: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
