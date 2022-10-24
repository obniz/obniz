/**
 * @packageDocumentation
 *
 * @ignore
 */
/// <reference types="node" />
/// <reference types="node" />
import EventEmitter from 'eventemitter3';
import { Handle } from '../../bleTypes';
import { Hci } from '../hci';
import { Smp, SmpEncryptOptions } from './smp';
declare type AclStreamEventTypes = 'data' | 'end' | 'encrypt' | 'encryptFail';
/**
 *
 * @ignore
 */
export declare class AclStream extends EventEmitter<AclStreamEventTypes> {
    _hci: Hci;
    _handle: Handle;
    _smp: Smp;
    onSmpFailBinded: any;
    onSmpEndBinded: any;
    constructor(hci: Hci, handle: Handle, localAddressType: any, localAddress: any, remoteAddressType: any, remoteAddress: any);
    debugHandler: any;
    encryptWait(options?: SmpEncryptOptions): Promise<void>;
    setEncryptOption(options: SmpEncryptOptions): void;
    write(cid: any, data: any): void;
    readWait(cid: any, flag: number, timeout?: number): Promise<Buffer>;
    push(cid: number, data: Buffer): void;
    end(): void;
    onSmpStkWait(stk: any): Promise<number | "refresh">;
    onSmpLtkWait(ltk: Buffer, random: Buffer, diversifier: Buffer): Promise<number | "refresh">;
    onSmpFail(): void;
    onSmpEnd(): void;
    startEncrypt(option: any): void;
    private debug;
}
export {};
