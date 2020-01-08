/// <reference types="node" />
export = Gatt;
declare const Gatt_base: typeof import("events").EventEmitter;
declare class Gatt extends Gatt_base {
    maxMtu: number;
    _mtu: number;
    _preparedWriteRequest: {
        handle: any;
        valueHandle: any;
        offset: any;
        data: any;
    } | null;
    onAclStreamDataBinded: (cid: any, data: any) => void;
    onAclStreamEndBinded: () => void;
    setServices(services: any): void;
    _handles: any[] | undefined;
    setAclStream(aclStream: any): void;
    _aclStream: any;
    onAclStreamData(cid: any, data: any): void;
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
    _lastIndicatedAttribute: any;
    addListener(event: string | symbol, listener: (...args: any[]) => void): Gatt;
    on(event: string | symbol, listener: (...args: any[]) => void): Gatt;
    once(event: string | symbol, listener: (...args: any[]) => void): Gatt;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): Gatt;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): Gatt;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): Gatt;
    off(event: string | symbol, listener: (...args: any[]) => void): Gatt;
    removeAllListeners(event?: string | symbol | undefined): Gatt;
    setMaxListeners(n: number): Gatt;
}
