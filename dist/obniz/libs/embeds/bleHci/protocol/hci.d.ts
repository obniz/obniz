/// <reference types="node" />
export = Hci;
declare const Hci_base: typeof import("events").EventEmitter;
declare class Hci extends Hci_base {
    constructor(obnizHci: any);
    _obnizHci: any;
    _state: any;
    _handleBuffers: {};
    _socket: {
        write: (data: any) => void;
    };
    initWait(): Promise<any>;
    setEventMask(): void;
    reset(): void;
    resetBuffers(): void;
    _handleAclsInProgress: {} | undefined;
    _aclOutQueue: any;
    readLocalVersion(): void;
    readBdAddr(): void;
    setLeEventMask(): void;
    readLeHostSupported(): void;
    writeLeHostSupported(): void;
    setScanParameters(): void;
    setScanEnabled(enabled: any, filterDuplicates: any): void;
    createLeConn(address: any, addressType: any): void;
    connUpdateLe(handle: any, minInterval: any, maxInterval: any, latency: any, supervisionTimeout: any): void;
    startLeEncryption(handle: any, random: any, diversifier: any, key: any): void;
    disconnect(handle: any, reason: any): void;
    readRssi(handle: any): void;
    writeAclDataPkt(handle: any, cid: any, data: any): void;
    setAdvertisingParameters(): void;
    setAdvertisingData(data: any): void;
    setScanResponseData(data: any): void;
    setAdvertiseEnable(enabled: any): void;
    leReadBufferSize(): void;
    readBufferSize(): void;
    queueAclDataPkt(handle: any, cid: any, data: any): void;
    pushAclOutQueue(): void;
    writeOneAclDataPkt(): void;
    onSocketData(array: any): void;
    onSocketError(error: any): void;
    processCmdCompleteEvent(cmd: any, status: any, result: any): void;
    addressType: string | undefined;
    address: any;
    _aclMtu: any;
    _aclMaxInProgress: any;
    processLeMetaEvent(eventType: any, status: any, data: any): void;
    processLeConnComplete(status: any, data: any): void;
    processLeAdvertisingReport(count: any, data: any): void;
    processLeConnUpdateComplete(status: any, data: any): void;
    processCmdStatusEvent(cmd: any, status: any): void;
    processLeReadBufferSize(result: any): void;
    onStateChange(state: any): void;
    addListener(event: string | symbol, listener: (...args: any[]) => void): Hci;
    on(event: string | symbol, listener: (...args: any[]) => void): Hci;
    once(event: string | symbol, listener: (...args: any[]) => void): Hci;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): Hci;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): Hci;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): Hci;
    off(event: string | symbol, listener: (...args: any[]) => void): Hci;
    removeAllListeners(event?: string | symbol | undefined): Hci;
    setMaxListeners(n: number): Hci;
}
declare namespace Hci {
    export { STATUS_MAPPER };
}
declare let STATUS_MAPPER: any;
