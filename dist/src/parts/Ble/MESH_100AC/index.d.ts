/**
 * @packageDocumentation
 * @module Parts.MESH_100AC
 */
import { MESH } from '../utils/abstracts/MESH';
import { Move } from '../utils/abstracts/MESHjs/block/Move';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
export interface MESH_100ACOptions {
}
/**
 * advertisement data from MESH_100AC
 */
export interface MESH_100AC_Data {
    name: string;
    address: string;
}
/** MESH_100AC management class */
export default class MESH_100AC extends MESH<MESH_100AC_Data> {
    static readonly PartsName = "MESH_100AC";
    static readonly LocalName: RegExp;
    accele: Move['accele'];
    onTapped: ((accele: MESH_100AC['accele']) => void) | null;
    onShaked: ((accele: MESH_100AC['accele']) => void) | null;
    onFlipped: ((accele: MESH_100AC['accele']) => void) | null;
    onOrientationChanged: ((face: number, accele: MESH_100AC['accele']) => void) | null;
    protected readonly staticClass: typeof MESH_100AC;
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
