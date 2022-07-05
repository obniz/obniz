/**
 * @packageDocumentation
 * @module Parts.MESH_100MD
 */
import { MESH } from '../utils/abstracts/MESH';
export interface MESH_100MDOptions {
}
/**
 * advertisement data from MESH_100MD
 */
export interface MESH_100MD_Data {
    /** battery (0 ~ 10) */
    battery: number;
}
/** MESH_100MD management class */
export default class MESH_100MD extends MESH<MESH_100MD_Data> {
    static readonly PartsName = "MESH_100MD";
    static readonly _LocalName = "MESH-100MD";
    static AvailableBleMode: "Connectable";
    protected readonly staticClass: typeof MESH_100MD;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected _notify(data: any): void;
    getDataWait(): Promise<{
        localname: string | null;
        address: string;
        battery: number;
    }>;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
    setMode(requestid: number, mode: number, time1: number, time2: number): void;
}
