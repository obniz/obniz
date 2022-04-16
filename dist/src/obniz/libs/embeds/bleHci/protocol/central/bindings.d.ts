/**
 * @packageDocumentation
 *
 * @ignore
 */
/// <reference types="node" />
import EventEmitter from 'eventemitter3';
import BleCharacteristic from '../../bleCharacteristic';
import { BleDeviceAddress, BleDeviceAddressType, BleDeviceAddressWithColon, BleDiscoveryAdvertisement, Handle, UUID } from '../../bleTypes';
import Hci, { HciState } from '../hci';
import { HandleIndex } from '../peripheral/gatt';
import { SmpEncryptOptions } from './smp';
declare type NobleBindingsEventType = 'discover' | 'disconnect' | 'stateChange' | 'notification' | 'handleNotify';
/**
 * @ignore
 */
declare class NobleBindings extends EventEmitter<NobleBindingsEventType> {
    private _state;
    private _handles;
    private _addresses;
    private _gatts;
    private _aclStreams;
    private _signalings;
    private _hci;
    private _gap;
    private _scanServiceUuids;
    private _connectPromises;
    constructor(hciProtocol: Hci);
    /**
     * @ignore
     * @private
     */
    _reset(): void;
    debugHandler: any;
    startScanningWait(serviceUuids: UUID[], allowDuplicates: boolean, activeScan: boolean): Promise<void>;
    stopScanningWait(): Promise<void>;
    /**
     * Connect to BLE device
     *
     * @param peripheralDeviceAddress ex: 0123456789ab
     * @param peripheralAddressType public | random | rpa_public | rpa_random
     * @param mtu bytes
     * @param onConnectCallback
     */
    connectWait(address: BleDeviceAddress, addressType: BleDeviceAddressType, mtu: number | null, onConnectCallback?: () => void): Promise<void>;
    disconnect(address: BleDeviceAddress): void;
    updateRssiWait(address: BleDeviceAddress): Promise<number>;
    onStateChange(state: HciState): void;
    onDiscover(status: 0, addressWithColon: BleDeviceAddressWithColon, addressType: BleDeviceAddressType, connectable: boolean, advertisement: BleDiscoveryAdvertisement, rssi: number): void;
    onLeConnComplete(status: number, handle: number, role: number, addressType: BleDeviceAddressType, addressWithColon: BleDeviceAddressWithColon, interval: number, latency: number, supervisionTimeout: number, masterClockAccuracy: number): void;
    onDisconnComplete(handle: number, reason: number): void;
    /** not used */
    onAclDataPkt(handle: number, cid: number, data: Buffer): void;
    discoverServicesWait(address: BleDeviceAddress, uuids?: UUID[]): Promise<UUID[]>;
    /** not used */
    discoverIncludedServicesWait(address: string, serviceUuid: UUID, serviceUuids: UUID[]): Promise<UUID[] | undefined>;
    discoverCharacteristicsWait(address: BleDeviceAddress, serviceUuid: UUID, characteristicUuids?: UUID[]): Promise<BleCharacteristic[]>;
    readWait(address: BleDeviceAddress, serviceUuid: UUID, characteristicUuid: UUID): Promise<Buffer>;
    writeWait(address: BleDeviceAddress, serviceUuid: UUID, characteristicUuid: UUID, data: Buffer, withoutResponse: boolean): Promise<void>;
    /** not used */
    broadcastWait(address: BleDeviceAddress, serviceUuid: UUID, characteristicUuid: UUID, broadcast: boolean): Promise<void>;
    notifyWait(address: BleDeviceAddress, serviceUuid: UUID, characteristicUuid: UUID, notify: boolean): Promise<void>;
    onNotification(addressWithColon: BleDeviceAddressWithColon, serviceUuid: UUID, characteristicUuid: UUID, data: Buffer): void;
    discoverDescriptorsWait(address: BleDeviceAddress, serviceUuid: UUID, characteristicUuid: UUID): Promise<UUID[]>;
    readValueWait(address: BleDeviceAddress, serviceUuid: UUID, characteristicUuid: UUID, descriptorUuid: UUID): Promise<Buffer>;
    writeValueWait(address: BleDeviceAddress, serviceUuid: UUID, characteristicUuid: UUID, descriptorUuid: UUID, data: Buffer): Promise<void>;
    /** not used */
    readHandleWait(address: BleDeviceAddress, attHandle: HandleIndex): Promise<Buffer>;
    /** not used */
    writeHandleWait(address: BleDeviceAddress, attHandle: HandleIndex, data: Buffer, withoutResponse: boolean): Promise<void>;
    onHandleNotify(addressWithColon: BleDeviceAddress, handle: HandleIndex, data: Buffer): void;
    onConnectionParameterUpdateWait(handle: Handle, minInterval: number, maxInterval: number, latency: number, supervisionTimeout: number): void;
    pairingWait(address: BleDeviceAddress, options?: SmpEncryptOptions): Promise<string>;
    setPairingOption(address: BleDeviceAddress, options: SmpEncryptOptions): void;
    private getGatt;
    private debug;
}
export default NobleBindings;
