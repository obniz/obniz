/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
/// <reference types="node" />
import Obniz from "../../index";
declare type TCPCallbackFunction = (data: number[]) => void;
export default class Tcp {
    Obniz: Obniz;
    id: number;
    connectObservers: any;
    readObservers: TCPCallbackFunction[];
    used: boolean;
    onconnection: any;
    onreceive: any;
    onerror: any;
    constructor(obniz: Obniz, id: number);
    _reset(): void;
    _addConnectObserver(callback: any): void;
    _addReadObserver(callback: TCPCallbackFunction): void;
    connectWait(port: number, domain: string): Promise<unknown>;
    close(): void;
    write(data: number | number[] | Buffer | string): void;
    readWait(): Promise<number[]>;
    end(): void;
    notified(obj: any): void;
    isUsed(): boolean;
}
export {};
