/**
 * @packageDocumentation
 * @module Parts.MESH_100MD
 */
import { MESH } from '../utils/abstracts/MESH';
import { MeshJsMd } from '../MESH_js/MeshJsMd';
export interface MESH_100MDOptions {
}
/**
 * advertisement data from MESH_100MD
 */
export interface MESH_100MD_Data {
    name: string;
    address: string;
    battery: number /** battery (0 ~ 10) */;
    motion_state: number;
    detection_mode: number;
    request_id: number;
}
/** MESH_100MD management class */
export default class MESH_100MD extends MESH<MESH_100MD_Data> {
    static readonly PartsName = "MESH_100MD";
    static readonly PREFIX = "MESH-100MD";
    onNotify: ((resp: MeshJsMd['response_']) => void) | null;
    protected readonly staticClass: typeof MESH_100MD;
    getDataWait(): Promise<{
        name: string;
        address: string;
        battery: number;
        motion_state: number;
        detection_mode: number;
        request_id: number;
    }>;
    setMode(detectionMode: number, opt_detectionTime?: number, opt_responseTime?: number, opt_requestId?: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
