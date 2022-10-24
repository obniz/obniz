/// <reference types="node" />
/// <reference types="node" />
import { HandleIndex } from '../peripheral/gatt';
import { AclStream } from './acl-stream';
import EventEmitter from 'eventemitter3';
import { BleDeviceAddress, UUID } from '../../bleTypes';
import { SmpEncryptOptions } from './smp';
declare type GattEventTypes = 'notification' | 'handleConfirmation' | 'handleNotify' | 'end';
/**
 * @ignore
 */
export declare class GattCentral extends EventEmitter<GattEventTypes> {
    onAclStreamDataBinded: (cid: number, data: Buffer) => void;
    onAclStreamEndBinded: () => void;
    private _address;
    private _aclStream;
    private _services;
    private _characteristics;
    private _descriptors;
    private _currentCommand;
    private _commandQueue;
    private _mtu;
    private _security;
    private _commandPromises;
    private _gattCommon;
    private _remoteMtuRequest;
    private _gattPeripheral;
    constructor(address: BleDeviceAddress, aclStream: AclStream);
    hasEncryptKeys(): boolean;
    getEncryptKeys(): string | null;
    encryptWait(options: SmpEncryptOptions): Promise<string>;
    setEncryptOption(options: SmpEncryptOptions): void;
    onEnd(reason: any): void;
    exchangeMtuWait(mtu: number | null): Promise<number>;
    discoverServicesWait(uuids: UUID[]): Promise<UUID[]>;
    discoverPrimaryServicesWait(uuids: UUID[]): Promise<UUID[]>;
    discoverSecondaryServicesWait(uuids: UUID[]): Promise<UUID[]>;
    discoverIncludedServicesWait(serviceUuid: UUID, uuids: UUID[]): Promise<string[] | undefined>;
    discoverCharacteristicsWait(serviceUuid: UUID, characteristicUuids: UUID[]): Promise<any[]>;
    readWait(serviceUuid: UUID, characteristicUuid: UUID): Promise<Buffer>;
    writeWait(serviceUuid: UUID, characteristicUuid: UUID, data: Buffer, withoutResponse: boolean): Promise<void>;
    broadcastWait(serviceUuid: UUID, characteristicUuid: UUID, broadcast: boolean): Promise<void>;
    notifyWait(serviceUuid: UUID, characteristicUuid: UUID, notify: boolean): Promise<void>;
    notifyByDescriptorWait(serviceUuid: UUID, characteristicUuid: UUID, notify: boolean): Promise<void>;
    notifyByHandleWait(serviceUuid: any, characteristicUuid: any, notify: any): Promise<void>;
    discoverDescriptorsWait(serviceUuid: UUID, characteristicUuid: UUID): Promise<UUID[]>;
    readValueWait(serviceUuid: UUID, characteristicUuid: UUID, descriptorUuid: UUID): Promise<Buffer>;
    writeValueWait(serviceUuid: UUID, characteristicUuid: UUID, descriptorUuid: UUID, data: Buffer): Promise<Buffer>;
    readHandleWait(handle: HandleIndex): Promise<Buffer>;
    writeHandleWait(handle: HandleIndex, data: Buffer, withoutResponse: boolean): Promise<void>;
    private onAclStreamData;
    private onAclStreamEnd;
    private writeAtt;
    private longWriteWait;
    private getService;
    private getCharacteristic;
    private getDescriptor;
    private _queueCommand;
    private _runQueueCommand;
    private _serialPromiseQueueWait;
    private _execCommandWait;
    private _execNoRespCommandWait;
}
export {};
