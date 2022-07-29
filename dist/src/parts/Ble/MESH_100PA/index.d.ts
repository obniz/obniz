/**
 * @packageDocumentation
 * @module Parts.MESH_100PA
 */
import { MESH } from '../utils/abstracts/MESH';
import { MeshJsPa } from '../MESH_js/MeshJsPa';
export interface MESH_100PAOptions {
}
/**
 * advertisement data from MESH_100PA
 */
export interface MESH_100PA_Data {
    name: string;
    address: string;
    battery: number;
    proximity: number;
    brightness: number;
}
/** MESH_100PA management class */
export default class MESH_100PA extends MESH<MESH_100PA_Data> {
    static readonly PartsName = "MESH_100PA";
    static readonly PREFIX = "MESH-100PA";
    static readonly NotifyType: {
        readonly UPDATE_PROXIMITY: 4;
        readonly UPDATE_BRIGHTNESS: 8;
        readonly ONCE: 16;
        readonly ALWAYS: 32;
    };
    onNotify: ((resp: MeshJsPa['response_']) => void) | null;
    protected readonly staticClass: typeof MESH_100PA;
    getDataWait(): Promise<{
        name: string;
        address: string;
        battery: number;
        proximity: number;
        brightness: number;
    }>;
    setMode(type: number, opt_requestId?: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
