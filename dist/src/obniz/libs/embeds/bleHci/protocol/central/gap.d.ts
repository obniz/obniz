/**
 * @packageDocumentation
 *
 * @ignore
 */
/// <reference types="node" />
import EventEmitter from 'eventemitter3';
import { BleDeviceAddressType, BleDeviceAddressWithColon, BleDiscoveryAdvertisement } from '../../bleTypes';
import Hci from '../hci';
declare type GapEventTypes = 'scanStop' | 'discover';
/**
 * @ignore
 */
declare class Gap extends EventEmitter<GapEventTypes> {
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
    onHciLeAdvertisingReport(status: 0, type: number, address: BleDeviceAddressWithColon, addressType: BleDeviceAddressType, eir: Buffer, rssi: number): void;
    private setScanEnabledWait;
}
export default Gap;
