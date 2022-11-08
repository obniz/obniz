/// <reference types="node" />
/// <reference types="node" />
/**
 * @packageDocumentation
 *
 * @ignore
 */
import EventEmitter from 'eventemitter3';
import { Hci } from '../hci';
declare type AclStreamEventTypes = 'data' | 'end' | 'encryptChange';
/**
 * @ignore
 */
export declare class AclStream extends EventEmitter<AclStreamEventTypes> {
    _hci: Hci;
    _handle: any;
    encypted: any;
    _smp: any;
    encrypted: any;
    constructor(hci: any, handle: any, localAddressType: any, localAddress: any, remoteAddressType: any, remoteAddress: any);
    write(cid: number, data: Buffer): void;
    push(cid: number, data: Buffer): void;
    end(): void;
    pushEncrypt(encrypt: any): void;
}
export {};
