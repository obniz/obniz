/// <reference types="node" />
/**
 * @packageDocumentation
 *
 * @ignore
 */
import AclStream from "./acl-stream";
import EventEmitter from "eventemitter3";
import { BleDeviceAddress, UUID } from "../../bleTypes";
declare type GattEventTypes = "notification" | "handleConfirmation" | "handleNotify" | "end";
/**
 * @ignore
 */
declare class Gatt extends EventEmitter<GattEventTypes> {
    onAclStreamDataBinded: any;
    onAclStreamEndBinded: any;
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
    private _remoteMtuRequest;
    constructor(address: BleDeviceAddress, aclStream: AclStream);
    encryptWait(options: any): Promise<string>;
    setEncryptOption(options: any): void;
    onEnd(reason: any): void;
    exchangeMtuWait(mtu: any): Promise<any>;
    discoverServicesWait(uuids: any): Promise<any>;
    discoverIncludedServicesWait(serviceUuid: UUID, uuids: UUID[]): Promise<any>;
    discoverCharacteristicsWait(serviceUuid: UUID, characteristicUuids: any): Promise<any>;
    readWait(serviceUuid: any, characteristicUuid: any): Promise<Buffer>;
    writeWait(serviceUuid: any, characteristicUuid: any, data: any, withoutResponse: any): Promise<void>;
    broadcastWait(serviceUuid: any, characteristicUuid: any, broadcast: any): Promise<void>;
    notifyWait(serviceUuid: any, characteristicUuid: any, notify: any): Promise<void>;
    discoverDescriptorsWait(serviceUuid: any, characteristicUuid: any): Promise<UUID[]>;
    readValueWait(serviceUuid: any, characteristicUuid: any, descriptorUuid: any): Promise<Buffer>;
    writeValueWait(serviceUuid: any, characteristicUuid: any, descriptorUuid: any, data: any): Promise<Buffer>;
    readHandleWait(handle: any): Promise<Buffer>;
    writeHandleWait(handle: any, data: any, withoutResponse: any): Promise<void>;
    private onAclStreamData;
    private onAclStreamEnd;
    private writeAtt;
    private errorResponse;
    private mtuRequest;
    private mtuResponse;
    private readByGroupRequest;
    private readByTypeRequest;
    private readRequest;
    private readBlobRequest;
    private findInfoRequest;
    private writeRequest;
    private prepareWriteRequest;
    private executeWriteRequest;
    private handleConfirmation;
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
export default Gatt;
