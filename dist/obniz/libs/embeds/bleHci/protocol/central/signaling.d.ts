/// <reference types="node" />
export = Signaling;
declare const Signaling_base: typeof import("events").EventEmitter;
declare class Signaling extends Signaling_base {
    constructor(handle: any, aclStream: any);
    _handle: any;
    _aclStream: any;
    onAclStreamDataBinded: (cid: any, data: any) => void;
    onAclStreamEndBinded: () => void;
    onAclStreamData(cid: any, data: any): void;
    onAclStreamEnd(): void;
    processConnectionParameterUpdateRequest(identifier: any, data: any): void;
    addListener(event: string | symbol, listener: (...args: any[]) => void): Signaling;
    on(event: string | symbol, listener: (...args: any[]) => void): Signaling;
    once(event: string | symbol, listener: (...args: any[]) => void): Signaling;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): Signaling;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): Signaling;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): Signaling;
    off(event: string | symbol, listener: (...args: any[]) => void): Signaling;
    removeAllListeners(event?: string | symbol | undefined): Signaling;
    setMaxListeners(n: number): Signaling;
}
