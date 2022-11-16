/**
 * @packageDocumentation
 *
 * @ignore
 */
/// <reference types="node" />
/// <reference types="node" />
import EventEmitter from 'eventemitter3';
import { BleDeviceAddressWithColon, BleDeviceAddressType, BleDiscoveryAdvertisement } from '../../bleTypes';
import { Hci } from '../hci';
declare type GapEventTypes = 'scanStop' | 'discover';
/**
 * @ignore
 */
export declare class Gap extends EventEmitter<GapEventTypes> {
    _hci: Hci;
    _scanState: null | 'starting' | 'started' | 'stopping' | 'stopped';
    _scanFilterDuplicates: null | boolean;
    _discoveries: Record<BleDeviceAddressWithColon, {
        address: BleDeviceAddressWithColon;
        addressType: BleDeviceAddressType;
        connectable: boolean;
        advertisement: BleDiscoveryAdvertisement;
        rssi: number;
        count: number;
        hasScanResponse: boolean;
    }>;
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
    onHciLeExtendedAdvertisingReport(status: 0, type: number, address: BleDeviceAddressWithColon, addressType: BleDeviceAddressType, eir: Buffer, rssi: number, primaryPhy?: any, secondaryPhy?: any, sid?: any, txPower?: any, periodicAdvertisingInterval?: any, directAddressType?: any, directAddress?: any): void;
    private isAdvOrScanResp;
    onHciLeAdvertisingReport(status: any, type: number, address: any, addressType: any, eir: Buffer, rssi: number, extended: boolean): void;
    private setExtendedScanEnabledWait;
    private setScanEnabledWait;
}
export {};
