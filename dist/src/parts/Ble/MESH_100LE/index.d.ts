/**
 * @packageDocumentation
 * @module Parts.MESH_100LE
 */
import { MESH } from '../utils/abstracts/MESH';
export interface MESH_100LEOptions {
}
export interface MESH_100LE_Data {
    name: string;
    address: string;
    battery: number;
}
/** MESH_100TH management class */
export default class MESH_100LE extends MESH<MESH_100LE_Data> {
    static readonly PartsName = "MESH_100LE";
    static readonly PREFIX = "MESH-100LE";
    static Pattern: {
        readonly BLINK: 1;
        readonly FIREFLY: 2;
    };
    protected readonly staticClass: typeof MESH_100LE;
    getDataWait(): Promise<{
        name: string;
        address: string;
        battery: number;
    }>;
    /**
     * Light Up
     *
     * @param red 0 ~ 127
     * @param green 0 ~ 127
     * @param blue 0 ~ 127
     * @param totalTime 0 ~ 65,535 [ms]
     * @param cycleOnTime 0 ~ 65,535 [ms]
     * @param cycleOffTime 0 ~ 65,535 [ms]
     * @param pattern Pattern.BLINK or Pattern.FIREFLY
     * @returns
     */
    lightup(red: number, green: number, blue: number, totalTime: number, cycleOnTime: number, cycleOffTime: number, pattern: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
