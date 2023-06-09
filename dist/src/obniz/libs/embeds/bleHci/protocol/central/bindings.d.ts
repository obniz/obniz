/**
 * @packageDocumentation
 *
 * @ignore
 */
/// <reference types="node" />
/// <reference types="node" />
import EventEmitter from 'eventemitter3';
import { BleDeviceAddress, BleDeviceAddressType, Handle, UUID } from '../../bleTypes';
import { HciPhy, HciState } from '../hci';
import { HandleIndex } from '../peripheral/gatt';
import { SmpEncryptOptions } from './smp';
declare type NobleBindingsEventType = 'discover' | 'disconnect' | 'stateChange' | 'notification' | 'handleNotify' | 'updatePhy';
/**
 * @ignore
 */
export declare class NobleBindings extends EventEmitter<NobleBindingsEventType> {
    _connectable: {
        [key: string]: boolean;
    };
    private _state;
    private _addresses;
    private _addresseTypes;
    private _handles;
    private _gatts;
    private _aclStreams;
    private _signalings;
    private _hci;
    private _gap;
    private _scanServiceUuids;
    private _connectPromises;
    constructor(hciProtocol: any);
    /**
     * @ignore
     * @private
     */
    _reset(): void;
    debugHandler: any;
    addPeripheralData(uuid: UUID, addressType: BleDeviceAddressType): void;
    startExtendedScanningWait(serviceUuids: UUID[], allowDuplicates: boolean, activeScan: boolean, usePhy1m: boolean, usePhyCoded: boolean): Promise<void>;
    startScanningWait(serviceUuids: UUID[], allowDuplicates: boolean, activeScan: boolean): Promise<void>;
    stopScanningWait(): Promise<void>;
    stopExtendedScanningWait(): Promise<void>;
    connectWait(peripheralUuid: BleDeviceAddress, mtu: number | null, onConnectCallback?: any): Promise<void>;
    setDefaultPhyWait(usePhy1m: boolean, usePhy2m: boolean, usePhyCoded: boolean): Promise<void>;
    readPhyWait(address: string): Promise<{
        status: number;
        connectionHandle: number;
        txPhy: number;
        rxPhy: number;
    }>;
    setPhyWait(address: string, usePhy1m: boolean, usePhy2m: boolean, usePhyCoded: boolean, useCodedModeS8: boolean, useCodedModeS2: boolean): Promise<void>;
    onPhy(handler: number, txPhy: number, rxPhy: number): void;
    connectExtendedWait(peripheralUuid: BleDeviceAddress, mtu: number | null, onConnectCallback?: any, usePhy1m?: boolean, usePhy2m?: boolean, usePhyCoded?: boolean): Promise<void>;
    disconnect(peripheralUuid: any): void;
    updateRssiWait(peripheralUuid: UUID): Promise<number>;
    onStateChange(state: HciState): void;
    onDiscover(status: any, address: any, addressType: any, connectable: any, advertisement: any, rssi: number, primaryPhy: HciPhy, secondaryPhy: HciPhy): void;
    onLeConnComplete(status: any, handle: any, role: any, addressType: any, address: BleDeviceAddress, interval: any, latency: any, supervisionTimeout: any, masterClockAccuracy: any): void;
    onDisconnComplete(handle: any, reason: number): void;
    onAclDataPkt(handle: any, cid?: any, data?: any): void;
    discoverServicesWait(peripheralUuid: any, uuids?: any): Promise<string[]>;
    discoverIncludedServicesWait(peripheralUuid: BleDeviceAddress, serviceUuid: UUID, serviceUuids: UUID[]): Promise<string[] | undefined>;
    discoverCharacteristicsWait(peripheralUuid: BleDeviceAddress, serviceUuid: UUID, characteristicUuids?: UUID[]): Promise<any[]>;
    readWait(peripheralUuid: BleDeviceAddress, serviceUuid: UUID, characteristicUuid: UUID): Promise<Buffer>;
    writeWait(peripheralUuid: BleDeviceAddress, serviceUuid: UUID, characteristicUuid: UUID, data: Buffer, withoutResponse: boolean): Promise<void>;
    broadcastWait(peripheralUuid: BleDeviceAddress, serviceUuid: UUID, characteristicUuid: UUID, broadcast: boolean): Promise<void>;
    notifyWait(peripheralUuid: BleDeviceAddress, serviceUuid: UUID, characteristicUuid: UUID, notify: boolean): Promise<void>;
    onNotification(address: BleDeviceAddress, serviceUuid?: UUID, characteristicUuid?: UUID, data?: Buffer): void;
    discoverDescriptorsWait(peripheralUuid: BleDeviceAddress, serviceUuid: UUID, characteristicUuid: UUID): Promise<UUID[]>;
    readValueWait(peripheralUuid: BleDeviceAddress, serviceUuid: UUID, characteristicUuid: UUID, descriptorUuid: UUID): Promise<Buffer>;
    writeValueWait(peripheralUuid: BleDeviceAddress, serviceUuid: UUID, characteristicUuid: UUID, descriptorUuid: UUID, data: Buffer): Promise<void>;
    readHandleWait(peripheralUuid: BleDeviceAddress, attHandle: HandleIndex): Promise<Buffer>;
    writeHandleWait(peripheralUuid: BleDeviceAddress, attHandle: HandleIndex, data: Buffer, withoutResponse: boolean): Promise<void>;
    onHandleNotify(address: BleDeviceAddress, handle?: HandleIndex, data?: Buffer): void;
    onConnectionParameterUpdateWait(handle: Handle, minInterval: number, maxInterval: number, latency: number, supervisionTimeout: number): void;
    isPairingFinishedWait(peripheralUuid: BleDeviceAddress): Promise<boolean>;
    getPairingKeysWait(peripheralUuid: BleDeviceAddress): Promise<string | null>;
    pairingWait(peripheralUuid: BleDeviceAddress, options?: SmpEncryptOptions): Promise<string>;
    setPairingOption(peripheralUuid: BleDeviceAddress, options: SmpEncryptOptions): void;
    private getGatt;
    private debug;
}
export {};
