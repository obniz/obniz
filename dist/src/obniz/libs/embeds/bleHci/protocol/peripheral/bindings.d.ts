/**
 * @packageDocumentation
 *
 * @ignore
 */
/// <reference types="node" />
/// <reference types="node" />
import { Hci } from '../hci';
import EventEmitter from 'eventemitter3';
import { Handle } from '../../bleTypes';
import { Gap } from './gap';
import { GattPeripheral } from './gatt';
declare type BlenoBindingsEventType = 'stateChange' | 'mtuChange' | 'accept' | 'disconnect';
/**
 * @ignore
 */
export declare class BlenoBindings extends EventEmitter<BlenoBindingsEventType> {
    _state: any;
    _advertising: any;
    _extended: boolean;
    _hci: Hci;
    _gap: Gap;
    _gatt: GattPeripheral;
    _address: any;
    _handle: Handle | null;
    private _aclStream;
    constructor(hciProtocol: any);
    /**
     * @ignore
     * @private
     */
    _reset(): void;
    startAdvertisingWait(name: any, serviceUuids: any): Promise<void>;
    startAdvertisingIBeaconWait(data: any): Promise<void>;
    startAdvertisingWithEIRDataWait(advertisementData: any, scanData: any): Promise<void>;
    stopAdvertisingWait(): Promise<void>;
    setExtendedAdvertisingParametersWait(handle: number, eventProperties: number, primaryAdvertisingPhy: number, secondaryAdvertisingPhy: number, txPower: number): Promise<void>;
    setExtendedAdvertisingDataWait(handle: number, data: Buffer): Promise<void>;
    setExtendedAdvertisingScanResponseDataWait(handle: number, data: Buffer): Promise<void>;
    startExtendedAdvertisingWait(handle: number): Promise<void>;
    stopExtendedAdvertisingWait(handle: number): Promise<void>;
    setServices(services: any): void;
    disconnect(): void;
    updateRssiWait(): Promise<number | null>;
    onStateChange(state: any): void;
    onLeConnComplete(status: any, handle?: any, role?: any, addressType?: any, address?: any, interval?: any, latency?: any, supervisionTimeout?: any, masterClockAccuracy?: any): void;
    onLeConnUpdateComplete(handle: any, interval?: any, latency?: any, supervisionTimeout?: any): void;
    onDisconnCompleteWait(handle: any, reason?: any): Promise<void>;
    onEncryptChange(handle: any, encrypt?: any): void;
    onMtuChange(mtu: any): void;
    onAclDataPkt(handle: Handle, cid?: any, data?: any): void;
}
export {};
