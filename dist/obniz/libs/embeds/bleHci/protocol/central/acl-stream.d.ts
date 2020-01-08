/// <reference types="node" />
export = AclStream;
declare const AclStream_base: typeof import("events").EventEmitter;
declare class AclStream extends AclStream_base {
    constructor(hci: any, handle: any, localAddressType: any, localAddress: any, remoteAddressType: any, remoteAddress: any);
    _hci: any;
    _handle: any;
    _smp: any;
    onSmpStkBinded: (stk: any) => void;
    onSmpFailBinded: () => void;
    onSmpEndBinded: () => void;
    encrypt(): void;
    write(cid: any, data: any): void;
    push(cid: any, data: any): void;
    pushEncrypt(encrypt: any): void;
    onSmpStk(stk: any): void;
    onSmpFail(): void;
    onSmpEnd(): void;
    addListener(event: string | symbol, listener: (...args: any[]) => void): AclStream;
    on(event: string | symbol, listener: (...args: any[]) => void): AclStream;
    once(event: string | symbol, listener: (...args: any[]) => void): AclStream;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): AclStream;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): AclStream;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): AclStream;
    off(event: string | symbol, listener: (...args: any[]) => void): AclStream;
    removeAllListeners(event?: string | symbol | undefined): AclStream;
    setMaxListeners(n: number): AclStream;
}
