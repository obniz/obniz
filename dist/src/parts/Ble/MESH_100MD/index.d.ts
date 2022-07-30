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
    name: string;
    address: string;
}
/** MESH_100MD management class */
export default class MESH_100MD extends MESH<MESH_100MD_Data> {
    static readonly PartsName = "MESH_100MD";
    static readonly PREFIX = "MESH-100MD";
    onSensorEvent: ((motionState: number, detectionMode: number) => void) | null;
    protected readonly staticClass: typeof MESH_100MD;
    getDataWait(): Promise<{
        name: string;
        address: string;
    }>;
    setMode(detectionMode: number, opt_detectionTime?: number, opt_responseTime?: number, opt_requestId?: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
