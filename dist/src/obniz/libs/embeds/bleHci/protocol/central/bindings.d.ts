/**
 * @packageDocumentation
 *
 * @ignore
 */
/// <reference types="node" />
import EventEmitter from "eventemitter3";
import { BleDeviceAddress, BleDeviceAddressType, Handle, UUID } from "../../bleTypes";
declare type NobleBindingsEventType = "discover" | "disconnect" | "stateChange" | "notification" | "handleNotify";
/**
 * @ignore
 */
declare class NobleBindings extends EventEmitter<NobleBindingsEventType> {
    _connectable: any;
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
    startScanningWait(serviceUuids: any, allowDuplicates: any, activeScan: boolean): Promise<void>;
    stopScanningWait(): Promise<void>;
    connectWait(peripheralUuid: any, onConnectCallback?: any): Promise<void>;
    disconnect(peripheralUuid: any): void;
    updateRssiWait(peripheralUuid: UUID): Promise<number>;
    onStateChange(state: any): void;
    onDiscover(status: any, address?: any, addressType?: any, connectable?: any, advertisement?: any, rssi?: any): void;
    onLeConnComplete(status: any, handle?: any, role?: any, addressType?: any, address?: BleDeviceAddress, interval?: any, latency?: any, supervisionTimeout?: any, masterClockAccuracy?: any): void;
    onDisconnComplete(handle: any, reason: number): void;
    onAclDataPkt(handle: any, cid?: any, data?: any): void;
    discoverServicesWait(peripheralUuid: any, uuids?: any): Promise<any>;
    discoverIncludedServicesWait(peripheralUuid: string, serviceUuid: UUID, serviceUuids: UUID[]): Promise<any>;
    discoverCharacteristicsWait(peripheralUuid: any, serviceUuid: any, characteristicUuids?: any): Promise<any>;
    readWait(peripheralUuid: any, serviceUuid: any, characteristicUuid: any): Promise<Buffer>;
    writeWait(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, data: any, withoutResponse: any): Promise<void>;
    broadcastWait(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, broadcast: any): Promise<void>;
    notifyWait(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, notify: any): Promise<void>;
    onNotification(address: any, serviceUuid?: any, characteristicUuid?: any, data?: any): void;
    discoverDescriptorsWait(peripheralUuid: UUID, serviceUuid: UUID, characteristicUuid: UUID): Promise<UUID[]>;
    readValueWait(peripheralUuid: UUID, serviceUuid: UUID, characteristicUuid: UUID, descriptorUuid: UUID): Promise<Buffer>;
    writeValueWait(peripheralUuid: any, serviceUuid: any, characteristicUuid: any, descriptorUuid: any, data: any): Promise<void>;
    readHandleWait(peripheralUuid: any, attHandle: any): Promise<Buffer>;
    writeHandleWait(peripheralUuid: any, attHandle: any, data: any, withoutResponse: any): Promise<void>;
    onHandleNotify(address: any, handle?: any, data?: any): void;
    onConnectionParameterUpdateWait(handle: Handle, minInterval?: any, maxInterval?: any, latency?: any, supervisionTimeout?: any): void;
    pairingWait(peripheralUuid: any, options?: any): Promise<string>;
    setPairingOption(peripheralUuid: any, options: any): void;
    private getGatt;
    private debug;
}
export default NobleBindings;
