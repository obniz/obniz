/**
 * @packageDocumentation
 * @module Parts.MESH_100MD
 */
import { MESH } from '../utils/abstracts/MESH';
import { MESH_js_MD } from '../MESH_js/MESH_js_MD';
export interface MESH_100MDOptions {
}
/**
 * advertisement data from MESH_100MD
 */
export interface MESH_100MD_Data {
    address: string;
    battery: number /** battery (0 ~ 10) */;
    motion_state: number;
    detection_mode: number;
}
/** MESH_100MD management class */
export default class MESH_100MD extends MESH<MESH_100MD_Data> {
    static readonly PartsName = "MESH_100MD";
    static readonly _LocalName = "MESH-100MD";
    onNotify: ((resp: MESH_js_MD['response']) => void) | null;
    protected readonly staticClass: typeof MESH_100MD;
    getDataWait(): Promise<{
        localname: string | null;
        address: string;
        battery: number;
        motion_state: number;
        detection_mode: number;
    }>;
    setMode(detection_mode: number, detection_time?: number, response_time?: number, requestid?: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
