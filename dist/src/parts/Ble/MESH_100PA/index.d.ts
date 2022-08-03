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
    static readonly EmitCondition: {
        ABOVE_UPPER_AND_BELOW_BOTTOM: 0;
        ABOVE_UPPER_AND_ABOVE_BOTTOM: 1;
        BELOW_UPPER_AND_BELOW_BOTTOM: 16;
        BELOW_UPPER_AND_ABOVE_BOTTOM: 17;
    };
    static readonly NotifyMode: {
        readonly STOP: 0;
        readonly EMIT_PROXIMITY: 1;
        readonly EMIT_BRIGHTNESS: 2;
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
    setMode(proximityRangeUpper: number, proximityRangeBottom: number, brightnessRangeUpper: number, brightnessRangeBottom: number, proximityCondition: number, brightnessCondition: number, notifyMode: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
    private setMode_;
    private setHandler_;
}
