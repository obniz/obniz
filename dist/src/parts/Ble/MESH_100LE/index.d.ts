/**
 * @packageDocumentation
 * @module Parts.MESH_100LE
 */
import { MESH } from '../utils/abstracts/MESH';
export interface MESH_100LEOptions {
}
export interface MESH_100LE_Data {
    /** battery (0 ~ 10) */
    battery: number;
}
/** MESH_100TH management class */
export default class MESH_100LE extends MESH<MESH_100LE_Data> {
    static readonly PartsName = "MESH_100LE";
    static readonly _LocalName = "MESH-100LE";
    static AvailableBleMode: "Connectable";
    protected readonly staticClass: typeof MESH_100LE;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    getDataWait(): Promise<{
        localname: string | null;
        address: string;
        battery: number;
    }>;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
    /**
     *
     * @param red
     * @param green
     * @param blue
     * @param time
     * @param cycle_on
     * @param cycle_off
     * @param pattern
     * @returns
     */
    lightup(red: number, green: number, blue: number, time: number, cycle_on: number, cycle_off: number, pattern: number): void;
}
