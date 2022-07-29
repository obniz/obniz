/**
 * @packageDocumentation
 * @module Parts.MESH_100BU
 */
import { MESH } from '../utils/abstracts/MESH';
export interface MESH_100BUOptions {
}
/**
 * advertisement data from MESH_100BU
 */
export interface MESH_100BU_Data {
    name: string;
    address: string;
    battery: number;
}
/** MESH_100BU management class */
export default class MESH_100BU extends MESH<MESH_100BU_Data> {
    static readonly PartsName = "MESH_100BU";
    static readonly PREFIX: "MESH-100BU";
    /** Event Handler */
    onSinglePressedNotify: (() => void) | null;
    onLongPressedNotify: (() => void) | null;
    onDoublePressedNotify: (() => void) | null;
    protected readonly staticClass: typeof MESH_100BU;
    getDataWait(): Promise<{
        name: string;
        address: string;
        battery: number;
    }>;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
