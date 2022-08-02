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
    static readonly NotifyMode: {
        readonly DETECTED: 1;
        readonly NOT_DETECTED: 2;
        readonly ONCE: 16;
        readonly ALWAYS: 32;
    };
    onSensorEvent: ((motionState: number, nofifyMode: number) => void) | null;
    protected readonly staticClass: typeof MESH_100MD;
    private retMotionState_;
    private notifyMode_;
    private detectionTime_;
    private responseTime_;
    getDataWait(): Promise<{
        name: string;
        address: string;
    }>;
    getSensorDataWait(): Promise<unknown>;
    setMode(notifyMode: number, opt_detectionTime?: number, opt_responseTime?: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
    private setMode_;
    private setHandler_;
}
