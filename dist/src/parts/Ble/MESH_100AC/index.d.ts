/**
 * @packageDocumentation
 * @module Parts.MESH_100AC
 */
import { MESH } from '../utils/abstracts/MESH';
export interface MESH_100ACOptions {
}
/**
 * advertisement data from MESH_100AC
 */
export interface MESH_100AC_Data {
    name: string;
    address: string;
    battery: number;
}
/** MESH_100AC management class */
export default class MESH_100AC extends MESH<MESH_100AC_Data> {
    static readonly PartsName = "MESH_100AC";
    static readonly PREFIX = "MESH-100AC";
    onTapped: ((acceleX: number, acceleY: number, acceleZ: number) => void) | null;
    onShaked: ((acceleX: number, acceleY: number, acceleZ: number) => void) | null;
    onFlipped: ((acceleX: number, acceleY: number, acceleZ: number) => void) | null;
    onOrientation: ((face: number, acceleX: number, acceleY: number, acceleZ: number) => void) | null;
    protected readonly staticClass: typeof MESH_100AC;
    getDataWait(): Promise<{
        name: string;
        address: string;
        battery: number;
    }>;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
