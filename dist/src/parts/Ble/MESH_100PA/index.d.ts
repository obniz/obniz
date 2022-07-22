/**
 * @packageDocumentation
 * @module Parts.MESH_100PA
 */
import { MESH } from '../utils/abstracts/MESH';
import { MESH_js_PA } from '../MESH_js/MESH_js_PA';
export interface MESH_100PAOptions {
}
/**
 * advertisement data from MESH_100PA
 */
export interface MESH_100PA_Data {
    name: string;
    address: string;
    /** battery (0 ~ 10) */
    battery: number;
    proximity: number;
    brightness: number;
}
/** MESH_100PA management class */
export default class MESH_100PA extends MESH<MESH_100PA_Data> {
    static readonly PartsName = "MESH_100PA";
    static readonly _LocalName = "MESH-100PA";
    static readonly NotifyType: {
        readonly UpdateProximity: 4;
        readonly UpdateBrightness: 8;
        readonly Once: 16;
        readonly Always: 32;
    };
    onNotify: ((resp: MESH_js_PA['response']) => void) | null;
    protected readonly staticClass: typeof MESH_100PA;
    getDataWait(): Promise<{
        name: string;
        address: string;
        battery: number;
        proximity: number;
        brightness: number;
    }>;
    setMode(type: number, request_id?: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
