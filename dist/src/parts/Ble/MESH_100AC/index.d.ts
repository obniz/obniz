/**
 * @packageDocumentation
 * @module Parts.MESH_100AC
 */
import { MESH } from '../utils/abstracts/MESH';
import { MeshJsAc } from '../MESH_js/MeshJsAc';
export interface MESH_100ACOptions {
}
/**
 * advertisement data from MESH_100AC
 */
export interface MESH_100AC_Data {
    name: string;
    address: string;
    battery: number;
    accele_x: number;
    accele_y: number;
    accele_z: number;
    face: number;
}
/** MESH_100AC management class */
export default class MESH_100AC extends MESH<MESH_100AC_Data> {
    static readonly PartsName = "MESH_100AC";
    static readonly PREFIX = "MESH-100AC";
    onTapped: ((accele: MeshJsAc['accele_']) => void) | null;
    onShaked: ((accele: MeshJsAc['accele_']) => void) | null;
    onFlipped: ((accele: MeshJsAc['accele_']) => void) | null;
    onDirection: ((face: number, accele: MeshJsAc['accele_']) => void) | null;
    protected readonly staticClass: typeof MESH_100AC;
    getDataWait(): Promise<{
        name: string;
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
