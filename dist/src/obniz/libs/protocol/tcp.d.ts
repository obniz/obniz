/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
/// <reference types="node" />
/// <reference types="node" />
import Obniz from '../../index';
import { ComponentAbstract } from '../ComponentAbstact';
/**
 * @param TCPReceiveCallbackFunction.data
 * received data
 */
declare type TCPReceiveCallbackFunction = (data: number[]) => void;
/**
 * @param TCPConnectionCallbackFunction.connected
 * - True : Connect
 * - False : Disconnect
 */
declare type TCPConnectionCallbackFunction = (connected: boolean) => void;
/**
 *
 * @param TCPErrorCallbackFunction.error
 * Error object
 */
declare type TCPErrorCallbackFunction = (error: any) => void;
/**
 * Create a TCP connection from a device throught the network the device is currently connected to.
 *
 * @category Protocol
 */
export declare class Tcp extends ComponentAbstract {
    /**
     * Callback function is called when there is a change in TCP connection status.
     *
     * ```
     * // Javascript Example
     * var tcp = obniz.getFreeTcp();
     *
     * tcp.onconnection = data => {
     *  console.log(data);
     * };
     * tcp.connectWait(80,"obniz.io");
     * ```
     */
    onconnection?: TCPConnectionCallbackFunction;
    /**
     * Callback function is called when TCP is received.
     *
     * ```javascript
     * // Javascript Example
     * var tcp = obniz.getFreeTcp();
     * tcp.connectWait(80,"obniz.io");
     *
     * tcp.onreceive = data => {
     *   console.log(data);
     * };
     * ```
     *
     */
    onreceive?: TCPReceiveCallbackFunction;
    /**
     * You can get the error message that occurred when connecting.
     *
     * ```javascript
     * // Javascript Example
     * var tcp = obniz.getFreeTcp();
     * tcp.connectWait(80,"obniz.io");
     *
     * tcp.onerror = state => {
     *   console.log(state);
     * };
     * ```
     */
    onerror?: TCPErrorCallbackFunction;
    private id;
    private connectObservers;
    private readObservers;
    private used;
    constructor(obniz: Obniz, id: number);
    /**
     * Starts a connection on the port and domain for which TCP is specified.
     *
     * ```javascript
     * // Javascript Example
     * var tcp = obniz.getFreeTcp();
     * tcp.connectWait(80,"obniz.io");
     * ```
     *
     * @param port
     * @param domain
     */
    connectWait(port: number, domain: string): Promise<void>;
    /**
     * The argument data is sent by TCP.
     *
     * If you pass a string or Array type argument, the data will be sent.
     *
     * ```javascript
     * // Javascript Example
     * var tcp = obniz.getFreeTcp();
     * tcp.connectWait(80,"obniz.io");
     *
     * // Array
     * tcp.write([0,1,2,3,4]);
     *
     * // Text
     * tcp.write('hello');
     * ```
     *
     * @param data
     */
    write(data: number | number[] | Buffer | string): void;
    /**
     * Wait for TCP reception.
     *
     * ```javascript
     * // Javascript Example
     * var tcp = obniz.getFreeTcp();
     * tcp.connectWait(80,"obniz.io");
     *
     * let data = await tcp.readWait();
     * console.log(data);
     * ```
     */
    readWait(): Promise<number[]>;
    /**
     * Terminates the TCP session.
     *
     * ```javascript
     * // Javascript Example
     * var tcp = obniz.getFreeTcp();
     * tcp.end();
     * ```
     */
    end(): void;
    /**
     * @ignore
     */
    isUsed(): boolean;
    schemaBasePath(): string;
    /**
     * @ignore
     * @private
     */
    protected _reset(): void;
    private close;
    private _addConnectObserver;
    private _addReadObserver;
}
export {};
