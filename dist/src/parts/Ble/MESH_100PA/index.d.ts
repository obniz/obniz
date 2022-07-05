/**
 * @packageDocumentation
 * @module Parts.MESH_100PA
 */
import { MESH } from '../utils/abstracts/MESH';
export interface MESH_100PAOptions {
}
/**
 * advertisement data from MESH_100LE
 */
export interface MESH_100PA_Data {
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
}
/** MESH_100PA management class */
export default class MESH_100PA extends MESH<MESH_100PA_Data> {
    static readonly PartsName = "MESH_100PA";
    static readonly _LocalName = "MESH-100PA";
    static AvailableBleMode: "Connectable";
    protected readonly staticClass: typeof MESH_100PA;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected _notify(data: any): void;
    getDataWait(): Promise<{
        battery: number;
    }>;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
