/**
 * @packageDocumentation
 * @module Parts.MESH_100PA
 */
import { MESH } from '../utils/abstracts/MESH';
export interface MESH_100PAOptions {
}
/**
 * advertisement data from MESH_100PA
 */
export interface MESH_100PA_Data {
    name: string;
    address: string;
}
/** MESH_100PA management class */
export default class MESH_100PA extends MESH<MESH_100PA_Data> {
    static readonly PartsName = "MESH_100PA";
    static readonly PREFIX = "MESH-100PA";
    static readonly NotifyMode: {
        readonly STOP: 0;
        readonly UPDATE_PROXIMITY: 4;
        readonly UPDATE_BRIGHTNESS: 8;
        readonly ONCE: 16;
        readonly ALWAYS: 32;
    };
    onSensorEvent: ((proximity: number, brightness: number) => void) | null;
    protected readonly staticClass: typeof MESH_100PA;
    private proximity_;
    private brightness_;
    getDataWait(): Promise<{
        name: string;
        address: string;
    }>;
    getSensorDataWait(): Promise<unknown>;
    setMode(type: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
    private setMode_;
}
