/**
 * @packageDocumentation
 * @module Parts.MESH_100PA
 */
import { MESH } from '../utils/abstracts/MESH';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
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
    static readonly LocalName: RegExp;
    static readonly NotifyMode: {
        readonly STOP: 0;
        readonly UPDATE_PROXIMITY: 4;
        readonly UPDATE_BRIGHTNESS: 8;
        readonly ONCE: 16;
        readonly ALWAYS: 32;
    };
    /**
     * Check MESH block
     *
     * @param peripheral
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(peripheral: BleRemotePeripheral, opt_serialnumber?: string): boolean;
    onSensorEvent: ((proximity: number, brightness: number) => void) | null;
    protected readonly staticClass: typeof MESH_100PA;
    private proximity_;
    private brightness_;
    /**
     * getDataWait
     *
     * @returns
     */
    getDataWait(): Promise<{
        proximity: number;
        brightness: number;
        name: string;
        address: string;
    }>;
    /**
     * getSensorDataWait
     *
     * @returns
     */
    getSensorDataWait(opt_timeoutMsec?: 5000): Promise<{
        proximity: number;
        brightness: number;
    }>;
    /**
     * setMode
     *
     * @param notifyMode
     */
    setMode(notifyMode: number): void;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
    private setMode_;
    private setHandler_;
}
