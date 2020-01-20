/// <reference types="node" />
import events from "events";
export default class Gatt extends events.EventEmitter {
    maxMtu: any;
    _mtu: any;
    _preparedWriteRequest: any;
    onAclStreamDataBinded: any;
    onAclStreamEndBinded: any;
    _handles: any;
    _aclStream: any;
    _lastIndicatedAttribute: any;
    constructor();
    setServices(services: any): void;
    setAclStream(aclStream: any): void;
    onAclStreamData(cid: any, data?: any): void;
    onAclStreamEnd(): void;
    send(data: any): void;
    errorResponse(opcode: any, handle: any, status: any): any;
    handleRequest(request: any): void;
    handleMtuRequest(request: any): any;
    handleFindInfoRequest(request: any): any;
    handleFindByTypeRequest(request: any): any;
    handleReadByGroupRequest(request: any): any;
    handleReadByTypeRequest(request: any): any;
    handleReadOrReadBlobRequest(request: any): any;
    handleWriteRequestOrCommand(request: any): any;
    handlePrepareWriteRequest(request: any): any;
    handleExecuteWriteRequest(request: any): any;
    handleConfirmation(request: any): void;
}
