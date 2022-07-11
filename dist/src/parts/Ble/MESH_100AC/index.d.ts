/**
 * @packageDocumentation
 * @module Parts.MESH_100AC
 */
import { MESH } from '../utils/abstracts/MESH';
import { MESH_js_AC } from '../MESH_js/MESH_js_AC';
export interface MESH_100ACOptions {
}
/**
 * advertisement data from MESH_100AC
 */
export interface MESH_100AC_Data {
    /** battery (0 ~ 10) */
    battery: number;
    accele_x: number;
    accele_y: number;
    accele_z: number;
    face: number;
}
/** MESH_100AC management class */
export default class MESH_100AC extends MESH<MESH_100AC_Data> {
    static readonly PartsName = "MESH_100AC";
    static readonly _LocalName = "MESH-100AC";
    onTapped: ((accele: MESH_js_AC['accele']) => void) | null;
    onShaked: ((accele: MESH_js_AC['accele']) => void) | null;
    onFlipped: ((accele: MESH_js_AC['accele']) => void) | null;
    onDirection: ((face: number, accele: MESH_js_AC['accele']) => void) | null;
    protected readonly staticClass: typeof MESH_100AC;
    getDataWait(): Promise<{
        localname: string | null;
        address: string;
        battery: number;
        accele_x: number;
        accele_y: number;
        accele_z: number;
        face: number;
    }>;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
