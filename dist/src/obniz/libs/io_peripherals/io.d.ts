/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import Obniz from '../../index';
import { ComponentAbstract } from '../ComponentAbstact';
import { DriveType, PullType } from './common';
/**
 * General purpose IO
 * This is available on each io (for obniz Board series, it's io0 to io11)
 *
 * @category Peripherals
 */
export declare class PeripheralIO extends ComponentAbstract {
    private value;
    private onchange?;
    private id;
    constructor(obniz: Obniz, id: number);
    /**
     * Make ioX to output mode and put out 1 or 0.
     *
     * ```javascript
     * // Javascript Example
     * obniz.io1.output(true); // io1 is 5v
     * obniz.io2.output(1); //  io2 is 5v
     * obniz.io3.drive("3v");
     * obniz.io3.output(1); // io3 is around 3v.
     * ```
     *
     * @param value output value
     */
    output(value: boolean | 0 | 1): void;
    /**
     * This allows you to change output drive method.
     * By default, it is set as push-pull 5v.
     *
     * ```javascript
     * // Javascript Example
     * obniz.io0.output(true); // output push-pull 5v
     *
     * obniz.io1.drive("3v");
     * obniz.io1.output(true); // output push-pull 3v
     *
     * obniz.io2.pull("5v");
     * obniz.io2.drive("open-drain");
     * obniz.io2.output(true); // output open-drain with 5v pull-up
     * ```
     *
     * @param drive
     *
     */
    drive(drive: DriveType): void;
    /**
     * This enables/disables internal weak pull up/down resistors.
     *
     * ```javascript
     * // Javascript Example
     * obniz.io0.pull("3v");
     * obniz.io0.drive("open-drain"); // output open-drain
     * obniz.io0.output(false);
     * ```
     *
     * @param updown
     *
     */
    pull(updown: PullType): void;
    /**
     * Make ioX to input mode.
     * Callback function will be called when io changes its input value.
     *
     *
     * @param callback
     */
    input(callback: (value: boolean) => void): boolean;
    /**
     * Make ioX to input mode.
     *
     * And this will return the current input value.
     * It pauses the process until the value is returned.
     *
     * ```javascript
     * // Javascript Example
     * var value = await obniz.io0.inputWait();
     * console.log(value);
     * ```
     */
    inputWait(): Promise<boolean>;
    /**
     * This ends output/input on ioX.
     *
     *
     * This function is effective only when using ioX.output() or ioX.input().
     * This won't be called when AD/UART/etc are used.
     * Pull-up down also will not affected.
     *
     * ```
     * // Javascript Example
     * obniz.io0.output(true)
     * obniz.io0.end();
     * ```
     *
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
