/**
 * @packageDocumentation
 * @module Parts.MESH_100BU
 */
import { MESH } from '../utils/abstracts/MESH';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
export interface MESH_100BUOptions {
}
/**
 * advertisement data from MESH_100BU
 */
export interface MESH_100BU_Data {
    name: string;
    address: string;
}
/** MESH_100BU management class */
export default class MESH_100BU extends MESH<MESH_100BU_Data> {
    static readonly PartsName = "MESH_100BU";
    static readonly LocalName: RegExp;
    /** Event Handler */
    onSinglePressed: (() => void) | null;
    onLongPressed: (() => void) | null;
    onDoublePressed: (() => void) | null;
    protected readonly staticClass: typeof MESH_100BU;
    /**
     * Check MESH block
     *
     * @param peripheral
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(peripheral: BleRemotePeripheral, opt_serialnumber?: string): boolean;
    /**
     * getDataWait
     *
     * @returns
     */
    getDataWait(): Promise<{
        name: string;
        address: string;
    }>;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
}
