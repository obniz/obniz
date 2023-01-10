/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import Obniz from '../../index';
import { ComponentAbstract } from '../ComponentAbstact';
import { PullType } from './common';
declare type I2CMode = 'master' | 'slave';
interface PeripheralI2CState {
    mode: I2CMode;
    sda: number;
    scl: number;
    pull?: PullType;
    gnd?: number;
}
interface PeripheralI2COptions extends PeripheralI2CState {
    mode: I2CMode;
    sda: number;
    scl: number;
    clock?: number;
    slave_address?: any;
    slave_address_length?: number;
}
/**
 * i2c can be used.
 * Master/Slave mode.
 * But slave mode only works with "written" events. You can't set data to be read.
 *
 * @category Peripherals
 */
export declare class PeripheralI2C extends ComponentAbstract {
    /**
     * from obniz.js 1.14.0
     *
     * It sets a function to receive error when i2c bus error occurs.
     * By setting a function, obniz.error will never be called.
     *
     * ```javascript
     * // Javascript Example
     * obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000});
     * obniz.i2c0.onerror = function(err) {
     *   console.log('Error', err);
     * }
     * var ret = await obniz.i2c0.readWait(0x50, 1);
     * ```
     */
    onerror?: (error: any) => void;
    /**
     * @ignore
     */
    used: boolean;
    /**
     * Slave mode only.
     *
     * It is a callback that is called when data is written.
     * Received data is fragmented.
     * When written data is 100byte, you possibly receive it in 56 byte and 44 byte.
     * For data over 1024 bytes, few bytes may be dropped.
     *
     * ```javascript
     * // Javascript Example
     * obniz.i2c0.start({mode: "slave", sda: 0, scl: 1, slave_address: 0x01});
     * obniz.i2c0.onwritten = function(data){
     *   console.log(data);
     * }
     * ```
     */
    onwritten?: (data: number[], address: number) => void;
    private state;
    private id;
    constructor(obniz: Obniz, id: number);
    /**
     * It starts i2c on given io sda, scl.
     *
     *
     * Internal pull up is optional for io output setting.
     * By default it is pull:null.
     * See more on obniz.ioX.pull().
     *
     * For using internal-pull-up, you should specify "3v" to connect to 3.3v targets, and "5v" for 5v targets.
     * When you choose internal pull up, speed is limited to up to 100khz, because internal pull up is not so tough.
     * Please add external pull-up resistor on scl/sda and choose pull:null when you need more speed.
     *
     *
     * ```javascript
     * // Javascript Example
     * obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000});
     * obniz.i2c0.write(0x50, [0x00, 0x00, 0x12]);
     * var ret = await obniz.i2c0.readWait(0x50, 1);
     * console.log("read "+ret);
     * ```
     *
     * - use internal pull up
     *
     * ```javascript
     * obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000, pull:"5v"});
     * ```
     *
     * - save mode
     *
     * ```javascript
     * obniz.i2c0.start({mode: "slave", sda: 0, scl: 1, slave_address: 0x01});
     * ```
     *
     * @param arg
     */
    start(arg: PeripheralI2COptions): void;
    /**
     * It sends data to device which has the address
     *
     * ```
     * // Javascript Example
     * obniz.i2c0.start({mode: "master",sda:2, scl:3, clock:400000, pull:null});
     * obniz.i2c0.write(0x50, [0x00, 0x00, 0x12]);
     * ```
     *
     * @param address 7bit address only.
     * @param data Max length is 1024;
     */
    write(address: number, data: number[]): void;
    /**
     * It reads data from the device. length defines the length of bytes. The treatment of address is same as write() function.
     * This function will wait until data is received.
     *
     * ```javascript
     * // Javascript Example
     * obniz.i2c0.start({mode: "master",sda:2, scl:3, clock:400000, pull:null});
     * var ret = await obniz.i2c0.readWait(0x50, 1);
     * console.log("read "+ret);
     * ```
     *
     * @param address
     * @param length Max is 1024;
     */
    readWait(address: number, length: number): Promise<number[]>;
    /**
     * @ignore
     */
    isUsed(): boolean;
    /**
     * end i2c .
     *
     * ```javascript
     * // Javascript Example
     * obniz.i2c0.start({mode:"master", sda:2, scl:3, clock:400000});
     * obniz.i2c0.end();
     * ```
     */
    end(): void;
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
export {};
