/**
 * @packageDocumentation
 *
 * @ignore
 */
import EventEmitter from 'eventemitter3';
import Hci from '../hci';
declare type GapEventTypes = 'scanStop' | 'discover';
/**
 * @ignore
 */
declare class Gap extends EventEmitter<GapEventTypes> {
    _hci: Hci;
    _scanState: null | 'starting' | 'started' | 'stopping' | 'stopped';
    _scanFilterDuplicates: null | boolean;
    _discoveries: any;
    constructor(hci: Hci);
    /**
     * @ignore
     * @private
     */
    _reset(): void;
    startScanningWait(allowDuplicates: boolean, activeScan: boolean): Promise<void>;
    stopScanningWait(): Promise<void>;
    onHciLeAdvertisingReport(status: any, type?: any, address?: any, addressType?: any, eir?: any, rssi?: any): void;
    private setScanEnabledWait;
}
export default Gap;
