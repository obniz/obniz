/**
 * @packageDocumentation
 * @module Parts.MESH_100MD
 */
import { MESH } from '../utils/abstracts/MESH';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
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
    static readonly LocalName: RegExp;
    static readonly NotifyMode: {
        readonly DETECTED: 1;
        readonly NOT_DETECTED: 2;
        readonly ONCE: 16;
        readonly ALWAYS: 32;
    };
    static readonly MotionState: {
        readonly SETUP: 0;
        readonly DETECTED: 1;
        readonly NOT_DETECTED: 2;
    };
    onSensorEvent: ((motionState: number, nofifyMode: number) => void) | null;
    protected readonly staticClass: typeof MESH_100MD;
    private retMotionState_;
    private notifyMode_;
    private holdingTime_;
    private detectionTime_;
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
        motionState: number;
    }>;
    /**
     * getSensorDataWait
     *
     * @returns
     */
    getSensorDataWait(opt_timeoutMsec?: 5000): Promise<number>;
    /**
     * setMode
     *
     * @param notifyMode
     * @param opt_holdingTime
     * @param opt_detectionTime
     */
    setMode(notifyMode: number, opt_holdingTime?: number, opt_detectionTime?: number): void;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
    private setMode_;
    private setHandler_;
}
