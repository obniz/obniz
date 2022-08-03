/**
 * @packageDocumentation
 * @module Parts.MESH_100LE
 */
import { MESH } from '../utils/abstracts/MESH';
import { LED } from '../MESH_js/block/LED';
export interface MESH_100LEOptions {
}
export interface MESH_100LE_Data {
    name: string;
    address: string;
}
/** MESH_100TH management class */
export default class MESH_100LE extends MESH<MESH_100LE_Data> {
    static readonly PartsName = "MESH_100LE";
    static readonly PREFIX = "MESH-100LE";
    static Pattern: {
        readonly BLINK: 1;
        readonly FIREFLY: 2;
    };
    colors: LED['colors'];
    protected readonly staticClass: typeof MESH_100LE;
    getDataWait(): Promise<{
        name: string;
        address: string;
    }>;
    /**
     * setLed
     *
     * @param colors red 0 ~ 127, green 0 ~ 127, blue 0 ~ 127
     * @param totalTime 0 ~ 65,535 [ms]
     * @param cycleOnTime 0 ~ 65,535 [ms]
     * @param cycleOffTime 0 ~ 65,535 [ms]
     * @param pattern Pattern.BLINK or Pattern.FIREFLY
     * @returns
     */
    setLed(colors: MESH_100LE['colors'], totalTime: number, cycleOnTime: number, cycleOffTime: number, pattern: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
