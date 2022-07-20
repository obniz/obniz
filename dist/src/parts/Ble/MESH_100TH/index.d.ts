/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
import { MESH } from '../utils/abstracts/MESH';
import { MESH_js_TH } from '../MESH_js/MESH_js_TH';
export interface MESH_100THOptions {
}
/**
 * advertisement data from MESH_100TH
 */
export interface MESH_100TH_Data {
    name: string;
    address: string;
    battery: number;
    temperature: number;
    humidity: number;
}
/** MESH_100TH management class */
export default class MESH_100TH extends MESH<MESH_100TH_Data> {
    static readonly PartsName = "MESH_100TH";
    static readonly _LocalName = "MESH-100TH";
    static readonly NotifyType: {
        readonly UpdateTemperature: 4;
        readonly UpdateHumidity: 8;
        readonly Once: 16;
        readonly Always: 32;
    };
    onNotify: ((resp: MESH_js_TH['response']) => void) | null;
    protected readonly staticClass: typeof MESH_100TH;
    getDataWait(): Promise<{
        name: string;
        address: string;
        battery: number;
        temperature: number;
        humidity: number;
    }>;
    setMode(temperature_upper: number, temperature_bottom: number, temperature_condition: number, humidity_upper: number, humidity_bottom: number, humidity_condision: number, type: number, request_id?: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
