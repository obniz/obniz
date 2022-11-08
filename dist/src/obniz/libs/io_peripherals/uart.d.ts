/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
/// <reference types="node" />
/// <reference types="node" />
import Obniz from '../../index';
import { ComponentAbstract } from '../ComponentAbstact';
import { BitType, DriveType, FlowControlType, ParityType, PullType, StopBitType } from './common';
export interface PeripheralUARTOptions {
    /**
     * Pin no of tx is used for sending data from obniz Board to parts.
     */
    tx: number;
    /**
     * Pin no of used for receiving data from parts to obniz Board.
     */
    rx: number;
    /**
     * Gnd pin no
     */
    gnd?: number;
    /**
     * Uart baud rate. efault is 115200bps
     */
    baud?: number;
    /**
     * Uart stop bit type.
     * Default is 1 Stop bit
     */
    stop?: StopBitType;
    /**
     * Uart bits. Default is 8bit
     */
    bits?: BitType;
    /**
     * Uart parity check. Default is "off"
     */
    parity?: ParityType;
    /**
     * Uart flow control type.
     * Default is off.
     */
    flowcontrol?: FlowControlType;
    /**
     * Pin no of rts
     */
    rts?: number;
    /**
     * Pin no of cts
     */
    cts?: number;
    /**
     * Pin drive type.
     */
    drive?: DriveType;
    /**
     * Pin pull type
     */
    pull?: PullType;
}
/**
 * Uart module
 *
 * @category Peripherals
 */
export declare class PeripheralUART extends ComponentAbstract {
    received: any;
    /**
     * @ignore
     */
    used: boolean;
    /**
     * It is called when data is received.
     * Data is array of bytes.
     * Text is the same data but in text representation.
     *
     *
     * So, if obniz Board receives 'A'.
     * - Data is [0x41]
     * - Text is "A"
     *
     * ```javascript
     * // Javascript Example
     * obniz.uart0.start({tx:0, rx:1})
     * obniz.uart0.onreceive = function(data, text) {
     *   console.log(data);
     *   console.log(text);
     * }
     * obniz.uart0.send("Hello");
     * ```
     *
     */
    onreceive?: (data: number[], text: string) => void;
    private id;
    private params;
    constructor(obniz: Obniz, id: number);
    /**
     * It starts uart on io tx, rx.
     *
     * You can start uart without much configuration. Just use as below.
     *
     * @param params
     */
    start(params: PeripheralUARTOptions): void;
    /**
     * This sends data.
     *
     * Available formats are
     *
     * - string
     * utf8 encoded byte array. Does not include null terminate
     *
     * - number
     * will be one byte data
     *
     * - array of number
     * array of bytes
     *
     * - Buffer
     * array of bytes
     *
     *
     * ```javascript
     * // Javascript Example
     * obniz.uart0.start({tx:0, rx:1})
     * obniz.uart0.send("Hi");
     * obniz.uart0.send(0x11);
     * obniz.uart0.send([0x11, 0x45, 0x44]);
     * ```
     *
     * @param data
     */
    send(data: string | number | number[] | Buffer): void;
    /**
     * It checks if there are data received but not yet used.
     * If there are, it returns true.
     *
     * If you are using onreceive callback, it will always be false because you receive the data with the callback function as the data arrives.
     *
     * ```javascript
     * // Javascript Example
     * obniz.uart0.start({tx:0, rx:1})
     *
     * while(1){
     *   if(obniz.uart0.isDataExists()){
     *      console.log(obniz.uart0.readText());
     *   }
     *   await obniz.wait(10);  //wait for 10ms
     * }
     * ```
     *
     */
    isDataExists(): boolean;
    /**
     * It returns the data array that are received but not yet used.
     *
     * ```javascript
     * // Javascript Example
     * obniz.uart0.start({tx:0, rx:1})
     *
     * while(1){
     *   if(obniz.uart0.isDataExists()){
     *      console.log(obniz.uart0.readBytes());
     *   }
     *   await obniz.wait(10);  //wait for 10ms
     * }
     * ```
     *
     * @return received data. If not exist data, return [].
     */
    readBytes(): number[];
    /**
     * It returns the one byte that are received but not yet used.
     *
     * ```javascript
     * // Javascript Example
     * obniz.uart0.start({tx:0, rx:1})
     *
     * while(1){
     *    if(obniz.uart0.isDataExists()){
     *      console.log(obniz.uart0.readBytes());
     *    }
     *    await obniz.wait(10);  //wait for 10ms
     * }
     * ```
     *
     * @return received data. If not exist data, return null.
     */
    readByte(): number | null;
    /**
     * It returns the data that are received but not yet used as string.
     *
     * ```javascript
     * // Javascript Example
     * obniz.uart0.start({tx:0, rx:1})
     *
     * while(1){
     *   if(obniz.uart0.isDataExists()){
     *     console.log(obniz.uart0.readText());
     *   }
     *   await obniz.wait(10);  //wait for 10ms
     * }
     * ```
     *
     * @return received text data. If not exist data, return null.
     */
    readText(): string | null;
    /**
     * @ignore
     */
    isUsed(): boolean;
    /**
     * It stops uart and releases io.
     *
     * ```javascript
     * // Javascript Example
     * obniz.uart0.start({tx:0, rx:1})
     * obniz.uart0.send("Hi");
     * obniz.uart0.end();
     * ```
     */
    end(): void;
    /**
     * Convert data array to string.
     *
     * @param data data array
     *
     * @return converted string. If convert failed, return null.
     */
    tryConvertString(data: number[]): string | null;
    /**
     * @ignore
     * @private
     */
    schemaBasePath(): string;
    /**
     * @ignore
     * @private
     */
    protected _reset(): void;
}
