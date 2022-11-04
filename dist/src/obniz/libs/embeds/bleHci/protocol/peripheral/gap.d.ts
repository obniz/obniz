/**
 * @packageDocumentation
 *
 * @ignore
 */
/// <reference types="node" />
/// <reference types="node" />
import EventEmitter from 'eventemitter3';
import { Hci } from '../hci';
declare type GapEventTypes = '';
/**
 * @ignore
 */
export declare class Gap extends EventEmitter<GapEventTypes> {
    _hci: Hci;
    _advertiseState: any;
    constructor(hci: any);
    /**
     * @ignore
     * @private
     */
    _reset(): void;
    startAdvertisingWait(name: any, serviceUuids: any): Promise<void>;
    startAdvertisingIBeaconWait(data: any): Promise<void>;
    setExtendedAdvertiseParametersWait(handle: number, eventProperties: number, primaryAdvertisingPhy: number, secondaryAdvertisingPhy: number, txPower: number): Promise<void>;
    setExtendedAdvertisingDataWait(handle: number, data: Buffer): Promise<void>;
    setExtendedAdvertisingScanResponseDataWait(handle: number, data: Buffer): Promise<void>;
    restartExtendedAdvertisingWait(handle: number): Promise<void>;
    stopExtendedAdvertisingWait(handle: number): Promise<void>;
    startExtendedAdvertisingWait(handle: number): Promise<void>;
    startAdvertisingWithEIRDataWait(advertisementData: any, scanData: any): Promise<void>;
    restartAdvertisingWait(): Promise<void>;
    stopAdvertisingWait(): Promise<void>;
}
export {};
