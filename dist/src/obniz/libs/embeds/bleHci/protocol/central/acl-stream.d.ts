/**
 * @packageDocumentation
 *
 * @ignore
 */
/// <reference types="node" />
import EventEmitter from "eventemitter3";
import { Handle } from "../../bleTypes";
import Hci from "../hci";
import Smp from "./smp";
declare type AclStreamEventTypes = "data" | "end" | "encrypt" | "encryptFail";
/**
 *
 * @ignore
 */
export default class AclStream extends EventEmitter<AclStreamEventTypes> {
    _hci: Hci;
    _handle: Handle;
    _smp: Smp;
    onSmpFailBinded: any;
    onSmpEndBinded: any;
    constructor(hci: Hci, handle: Handle, localAddressType: any, localAddress: any, remoteAddressType: any, remoteAddress: any);
    debugHandler: any;
    encryptWait(options?: any): Promise<string | number>;
    setEncryptOption(options?: any): void;
    write(cid: any, data: any): void;
    readWait(cid: any, flag: number, timeout?: number): Promise<Buffer>;
    push(cid: number, data: Buffer): void;
    end(): void;
    onSmpStkWait(stk: any): Promise<number | "refresh">;
    onSmpLtkWait(ltk: any, random: Buffer, diversifier: Buffer): Promise<number | "refresh">;
    onSmpFail(): void;
    onSmpEnd(): void;
    startEncrypt(option: any): void;
    private debug;
}
export {};
