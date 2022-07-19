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
    /** battery (0 ~ 10) */
    battery: number;
}
/** MESH_100TH management class */
export default class MESH_100LE extends MESH<MESH_100LE_Data> {
    static readonly PartsName = "MESH_100LE";
    static readonly _LocalName = "MESH-100LE";
    static Pattern: {
        readonly Blink: 1;
        readonly Soft: 2;
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
     * @param time 0 ~ 65535 [ms]
     * @param cycle_on 0 ~ 65535 [ms]
     * @param cycle_off 0 ~ 65535 [ms]
<<<<<<< HEAD
<<<<<<< HEAD
     * @param pattern 1 or 2
=======
     * @param pattern Pattern.Blink or Pattern.Soft
>>>>>>> a8042557d (gpio)
=======
     * @param pattern Pattern.Blink or Pattern.Soft
>>>>>>> a8042557d (gpio)
     * @returns
     */
    lightup(red: number, green: number, blue: number, time: number, cycle_on: number, cycle_off: number, pattern: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
