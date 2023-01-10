/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import Obniz from '../../index';
import { ComponentAbstract } from '../ComponentAbstact';
import { DriveType, PullType } from './common';
interface PeripheralSPIOptions {
    /**
     * SPI mode
     *
     * currently only "master" is supported
     */
    mode: 'master';
    /**
     * clock pin no
     */
    clk?: number;
    /**
     * mosi pin no
     */
    mosi?: number;
    /**
     * miso pin no
     */
    miso?: number;
    /**
     * frequency (Hz)
     */
    frequency: number;
    drive?: DriveType;
    pull?: PullType;
    /**
     * gnd pin no
     */
    gnd?: number;
}
/**
 * It is General Purpose SPI
 *
 * @category Peripherals
 */
export declare class PeripheralSPI extends ComponentAbstract {
    /**
     * @ignore
     */
    used: boolean;
    private id;
    private params;
    constructor(obniz: Obniz, id: number);
    /**
     * It starts spi. Now the mode is only "master".
     *
     *
     * drive and pull are optional settings for io output.
     * Default settings are drive:5v, pull:null.
     * See more using obniz.io.drive() or pull().
     *
     * ```javascript
     * // Javascript Example
     * obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000});
     * var ret = await obniz.spi0.writeWait([0x12, 0x98]);
     * console.log("received: "+ret);
     *
     * // drive and pull is optional
     * obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000, drive: "5v", pull:null});
     * ```
     *
     * @param params spi parameters
     */
    start(params: PeripheralSPIOptions): void;
    /**
     * It sends data to spi and wait until data are received.
     * The received data length is the same as the sent data.
     *
     * ```javascript
     * // Javascript Example
     * obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000});
     * var ret = await obniz.spi0.writeWait([0x12, 0x98]);
     * console.log("received: "+ret);
     * ```
     *
     *
     * @param data Max length is 1024 bytes.
     * @return received data
     */
    writeWait(data: number[]): Promise<number[]>;
    /**
     * It only sends data to spi and does not receive it.
     *
     * ```javascript
     * // Javascript Example
     * obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000});
     * obniz.spi0.write([0x12, 0x98]);
     * ```
     *
     * @param data Max length is 1024 bytes.
     */
    write(data: number[]): void;
    /**
     * @ignore
     */
    isUsed(): boolean;
    /**
     * It ends spi
     *
     * ```javascript
     * // Javascript Example
     * obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, clock:1000000});
     * obniz.spi0.write([0x12, 0x98]);
     * obniz.spi0.end();
     * ```
     *
     * @param reuse
     * - True : getFreeSpi will not return this object
     * - False : getFreeSpi will return this object
     */
    end(reuse?: boolean): void;
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
