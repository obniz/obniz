/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import Obniz from '../../index';
import { ComponentAbstract } from '../ComponentAbstact';
/**
 * @category Peripherals
 */
export declare class PeripheralAD extends ComponentAbstract {
    id: number;
    /**
     * called when voltage gets changed.
     *
     * @param onchange.value voltage of pin
     */
    onchange?: (value: number) => void;
    /**
     * The value will be stored in the value variable.
     *
     * Note: This property stores the last received value.
     * NOT the value when you read this property.
     *
     * ```Javascript
     * obniz.ad0.start();
     * while(true) {
     * console.log("changed to "+obniz.ad0.value+" v")
     *  await obniz.wait(10); // 10ms wait
     * }
     * ```
     */
    value: number;
    constructor(obniz: Obniz, id: number);
    /**
     * This starts measuring voltage on ioX until end() is called.
     * ```Javascript
     * obniz.ad0.start(function(voltage){
     *  console.log("changed to "+voltage+" v")
     * });
     * ```
     *
     * @param callback  called when voltage gets changed.
     * @param callback.voltage  voltage
     */
    start(callback?: (voltage: number) => void): number;
    /**
     * This measures the voltage just once and returns its value.
     * This function will pause until ad result arrives to your js.
     *
     * ```javascript
     * obniz.io0.output(true)
     * var voltage = await obniz.ad0.getWait();
     * obniz.io0.output(false)
     * console.log(""+voltage+" should be closed to 5.00");
     * ```
     *
     * @return measured voltage
     *
     */
    getWait(): Promise<number>;
    /**
     * This stops measuring voltage on ioX.
     * ```javascript
     * obniz.ad0.start();
     * obniz.ad0.end();
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
