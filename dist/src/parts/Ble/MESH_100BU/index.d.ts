/**
 * @packageDocumentation
 * @module Parts.MESH_100BU
 */
import { MESH } from '../utils/abstracts/MESH';
export interface MESH_100BUOptions {
}
/**
 * advertisement data from MESH_100BU
 *
 * MESH_100BUからのadvertisementデータ
 */
export interface MESH_100BU_Data {
    battery: number;
}
/** MESH_100BU management class MESH_100BUを管理するクラス */
export default class MESH_100BU extends MESH<MESH_100BU_Data> {
    static readonly PartsName = "MESH_100BU";
    static readonly _LocalName = "MESH-100BU";
    static AvailableBleMode: "Connectable";
    protected readonly staticClass: typeof MESH_100BU;
    /** event handler */
    onSinglePressed: (() => void) | null;
    onLongPressed: (() => void) | null;
    onDoublePressed: (() => void) | null;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected _notify(data: any): void;
    getDataWait(): Promise<{
        localname: string | null;
        address: string;
        battery: number;
    }>;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
