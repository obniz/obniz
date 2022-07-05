/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
import { MESH } from '../utils/abstracts/MESH';
export interface MESH_100THOptions {
}
/**
 * advertisement data from MESH_100TH
 *
 * MESH_100THからのadvertisementデータ
 */
export interface MESH_100TH_Data {
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /** temperature 温度 (Unit 単位: 0.01 degC)*/
    temperature: number;
    /** humidity 相対湿度 (Unit 単位: 1% RH) */
    humidity: number;
}
/** MESH_100TH management class */
export default class MESH_100TH extends MESH<MESH_100TH_Data> {
    static readonly PartsName = "MESH_100TH";
    static readonly _LocalName = "MESH-100TH";
    static AvailableBleMode: "Connectable";
    protected readonly staticClass: typeof MESH_100TH;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected _notify(data: any): void;
    getDataWait(): Promise<{
        battery: number;
        temperature: number;
        humidity: number;
    }>;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
    setMode(temperature_upper: number, temperature_bottom: number, temperature_condition: number, humidity_upper: number, humidity_bottom: number, humidity_condision: number, type: number): void;
}
