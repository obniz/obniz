/**
 * @packageDocumentation
 * @module Parts.MESH_100GP
 */
import { MESH } from '../utils/abstracts/MESH';
export interface MESH_100GPOptions {
}
/**
 * advertisement data from MESH_100GP
 */
export interface MESH_100GP_Data {
    name: string;
    address: string;
    /** battery (0 ~ 10) */
    battery: number;
}
/** MESH_100PA management class */
export default class MESH_100GP extends MESH<MESH_100GP_Data> {
    static readonly PartsName = "MESH_100GP";
    static readonly _LocalName = "MESH-100GP";
    onDinEvent: ((pin: number, state: number) => void) | null;
    onAinEvent: ((pin: number, type: number, threshold: number, level: number) => void) | null;
    onDinState: ((requestId: number, pin: number, state: number) => void) | null;
    onAinState: ((requestId: number, pin: number, state: number, mode: number) => void) | null;
    onVoutState: ((requestId: number, pin: number, state: number) => void) | null;
    onDoutState: ((requestId: number, pin: number, state: number) => void) | null;
    onPWMoutState: ((requestId: number, pin: number, level: number) => void) | null;
    protected readonly staticClass: typeof MESH_100GP;
    getDataWait(): Promise<{
        name: string;
        address: string;
        battery: number;
    }>;
    setMode(din: number, din_notify: number, dout: number, pwm_ratio: number, ain_range_upper: number, ain_range_bottom: number, ain_notify: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
