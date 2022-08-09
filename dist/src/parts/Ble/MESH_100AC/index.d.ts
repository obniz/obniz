/**
 * @packageDocumentation
 * @module Parts.MESH_100AC
 */
import { MESH } from '../utils/abstracts/MESH';
import { Move } from '../MESH_js/block/Move';
export interface MESH_100ACOptions {
}
/**
 * advertisement data from MESH_100AC
 */
export interface MESH_100AC_Data {
    name: string;
    address: string;
}
/** MESH_100AC management class */
export default class MESH_100AC extends MESH<MESH_100AC_Data> {
    static readonly PartsName = "MESH_100AC";
    static readonly PREFIX = "MESH-100AC";
    accele: Move['accele'];
    onTapped: ((accele: MESH_100AC['accele']) => void) | null;
    onShaked: ((accele: MESH_100AC['accele']) => void) | null;
    onFlipped: ((accele: MESH_100AC['accele']) => void) | null;
    onOrientationChanged: ((face: number, accele: MESH_100AC['accele']) => void) | null;
    protected readonly staticClass: typeof MESH_100AC;
    /**
     * getDataWait
     *
     * @returns
     */
    getDataWait(): Promise<{
        name: string;
        address: string;
    }>;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
