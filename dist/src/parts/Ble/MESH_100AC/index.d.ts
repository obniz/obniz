/**
 * @packageDocumentation
 * @module Parts.MESH_100AC
 */
import { MESH } from '../utils/abstracts/MESH';
import { MESH_AC } from '../MESH_js';
export interface MESH_100ACOptions {
}
/**
 * advertisement data from MESH_100AC
 */
export interface MESH_100AC_Data {
    /** battery 電源電圧 (Unit 単位: 0.01 V) */
    battery: number;
    /** temperature 温度 (Unit 単位: 0.01 degC)*/
    /** humidity 相対湿度 (Unit 単位: 1% RH) */
    accele_x: number;
    accele_y: number;
    accele_z: number;
    face: number;
}
/** MESH_100AC management class */
export default class MESH_100AC extends MESH<MESH_100AC_Data> {
    static readonly PartsName = "MESH_100AC";
    static readonly _LocalName = "MESH-100AC";
    static AvailableBleMode: "Connectable";
    protected readonly staticClass: typeof MESH_100AC;
    onTapped: ((accele: MESH_AC['accele']) => void) | null;
    onShaked: ((accele: MESH_AC['accele']) => void) | null;
    onFlipped: ((accele: MESH_AC['accele']) => void) | null;
    onDirection: ((face: number, accele: MESH_AC['accele']) => void) | null;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected _notify(data: any): void;
    getDataWait(): Promise<{
        localname: string | null;
        address: string;
        battery: number;
        accele_x: number;
        accele_y: number;
        accele_z: number;
        face: number;
    }>;
    writeTestWait(): Promise<void>;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
