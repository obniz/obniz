/// <reference types="node" />
/// <reference types="node" />
import { UUID } from '../../bleTypes';
import { AclStream } from './acl-stream';
import EventEmitter from 'eventemitter3';
export declare type HandleIndex = number;
interface GattServiceHandle {
    type: 'service';
    uuid: UUID;
    attribute: any;
    startHandle: HandleIndex;
    endHandle: HandleIndex;
}
interface GattIncludedServiceHandle {
    type: 'includedService';
    uuid: UUID;
    attribute: any;
    startHandle: HandleIndex;
    endHandle: HandleIndex;
}
interface GattCharacteristicHandle {
    type: 'characteristic';
    uuid: UUID;
    attribute: any;
    properties: any;
    secure: number;
    startHandle: HandleIndex;
    valueHandle: HandleIndex;
}
interface GattCharacteristicValueHandle {
    type: 'characteristicValue';
    handle: HandleIndex;
    value: any;
}
interface GattDescriptorHandle {
    type: 'descriptor';
    uuid: UUID;
    attribute: any;
    handle: HandleIndex;
    value: Buffer;
    properties: number;
    secure: number;
}
declare type GattHandle = GattServiceHandle | GattIncludedServiceHandle | GattCharacteristicHandle | GattCharacteristicValueHandle | GattDescriptorHandle;
declare type GattEventTypes = 'mtuChange';
/**
 * @ignore
 */
export declare class GattPeripheral extends EventEmitter<GattEventTypes> {
    maxMtu: number;
    _mtu: number;
    _preparedWriteRequest: any;
    onAclStreamDataBinded: any;
    onAclStreamEndBinded: any;
    _handles: GattHandle[];
    _aclStream?: AclStream;
    _lastIndicatedAttribute: any;
    private _gattCommon;
    constructor();
    /**
     * @ignore
     * @private
     */
    _reset(): void;
    setServices(services: any): void;
    setAclStream(aclStream: AclStream | undefined): void;
    onAclStreamData(cid: number, data: Buffer): void;
    onAclStreamEnd(): void;
    send(data: Buffer): void;
    handleRequest(request: Buffer): void;
    handleMtuRequest(request: Buffer): Buffer;
    handleFindInfoRequest(request: Buffer): Buffer;
    handleFindByTypeRequest(request: any): Buffer;
    handleReadByGroupRequest(request: any): Buffer;
    handleReadByTypeRequest(request: Buffer): Buffer | null;
    handleReadOrReadBlobRequest(request: Buffer): Buffer | null;
    handleWriteRequestOrCommand(request: Buffer): Buffer | null;
    handlePrepareWriteRequest(request: Buffer): Buffer;
    handleExecuteWriteRequest(request: Buffer): Buffer | null;
    handleConfirmation(request: Buffer): void;
}
export {};
