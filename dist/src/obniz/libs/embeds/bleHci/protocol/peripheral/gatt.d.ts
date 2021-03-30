/// <reference types="node" />
import AclStream from "./acl-stream";
import EventEmitter from "eventemitter3";
declare type GattEventTypes = "mtuChange";
/**
 * @ignore
 */
export default class Gatt extends EventEmitter<GattEventTypes> {
    maxMtu: number;
    _mtu: number;
    _preparedWriteRequest: any;
    onAclStreamDataBinded: any;
    onAclStreamEndBinded: any;
    _handles: any;
    _aclStream?: AclStream;
    _lastIndicatedAttribute: any;
    constructor();
    /**
     * @ignore
     * @private
     */
    _reset(): void;
    setServices(services: any): void;
    setAclStream(aclStream: AclStream | undefined): void;
    onAclStreamData(cid: any, data?: any): void;
    onAclStreamEnd(): void;
    send(data: any): void;
    errorResponse(opcode: any, handle: any, status: any): Buffer;
    handleRequest(request: any): void;
    handleMtuRequest(request: any): Buffer;
    handleFindInfoRequest(request: any): Buffer;
    handleFindByTypeRequest(request: any): Buffer;
    handleReadByGroupRequest(request: any): Buffer;
    handleReadByTypeRequest(request: any): Buffer | null;
    handleReadOrReadBlobRequest(request: any): Buffer | null;
    handleWriteRequestOrCommand(request: any): Buffer | null;
    handlePrepareWriteRequest(request: any): Buffer;
    handleExecuteWriteRequest(request: any): Buffer | null;
    handleConfirmation(request: any): void;
}
export {};
