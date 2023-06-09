/**
 * @packageDocumentation
 *
 * @ignore
 */
import EventEmitter from 'eventemitter3';
import { Hci, HciPhy } from '../hci';
declare type GapEventTypes = 'scanStop' | 'discover';
/**
 * @ignore
 */
export declare class Gap extends EventEmitter<GapEventTypes> {
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
    stopExtendedScanningWait(): Promise<void>;
    startExtendedScanningWait(allowDuplicates: boolean, activeScan: boolean, usePhy1m: boolean, usePhyCoded: boolean): Promise<void>;
    onHciLeExtendedAdvertisingReport(status: any, type?: any, address?: any, addressType?: any, eir?: any, rssi?: any, primaryPhy?: any, secondaryPhy?: any, sid?: any, txPower?: any, periodicAdvertisingInterval?: any, directAddressType?: any, directAddress?: any): void;
    private isAdvOrScanResp;
    onHciLeAdvertisingReport(status: any, type: number, address: any, addressType: any, eir: any, rssi: number, extended: boolean, primaryPhy: HciPhy, secondaryPhy: HciPhy): void;
    private setExtendedScanEnabledWait;
    private setScanEnabledWait;
}
export {};
