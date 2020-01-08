/// <reference types="node" />
export = Smp;
declare const Smp_base: typeof import("events").EventEmitter;
declare class Smp extends Smp_base {
    constructor(aclStream: any, localAddressType: any, localAddress: any, remoteAddressType: any, remoteAddress: any);
    _aclStream: any;
    _iat: Buffer;
    _ia: Buffer;
    _rat: Buffer;
    _ra: Buffer;
    onAclStreamDataBinded: (cid: any, data: any) => void;
    onAclStreamEndBinded: () => void;
    sendPairingRequest(): void;
    _preq: Buffer | undefined;
    onAclStreamData(cid: any, data: any): void;
    onAclStreamEnd(): void;
    handlePairingResponse(data: any): void;
    _pres: any;
    _tk: Buffer | undefined;
    _r: any;
    handlePairingConfirm(data: any): void;
    _pcnf: any;
    handlePairingRandom(data: any): void;
    handlePairingFailed(data: any): void;
    handleEncryptInfo(data: any): void;
    handleMasterIdent(data: any): void;
    write(data: any): void;
    addListener(event: string | symbol, listener: (...args: any[]) => void): Smp;
    on(event: string | symbol, listener: (...args: any[]) => void): Smp;
    once(event: string | symbol, listener: (...args: any[]) => void): Smp;
    prependListener(event: string | symbol, listener: (...args: any[]) => void): Smp;
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): Smp;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): Smp;
    off(event: string | symbol, listener: (...args: any[]) => void): Smp;
    removeAllListeners(event?: string | symbol | undefined): Smp;
    setMaxListeners(n: number): Smp;
}
