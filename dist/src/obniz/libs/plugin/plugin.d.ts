/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
/// <reference types="node" />
/// <reference types="node" />
import Obniz from '../../index';
/**
 * @param PluginReceiveCallbackFunction.data
 * received data
 */
declare type PluginReceiveCallbackFunction = (data: number[], str: string | null) => void;
export declare class Plugin {
    /**
     * Callback function is called when Plugin is received.
     *
     * ```javascript
     * // Javascript Example
     * obniz.plugin.onreceive = data => {
     *   console.log(data);
     * };
     * ```
     *
     */
    onreceive?: PluginReceiveCallbackFunction;
    private Obniz;
    constructor(obniz: Obniz, id: number);
    /**
     * Scan WiFi
     *
     * ```javascript
     * // Javascript Example
     * obniz.plugin.send("obniz.js send data")
     *
     * obniz.plugin.send([0x00, 0x01, 0x02])
     * ```
     *
     */
    send(data: string | number | number[] | Buffer): void;
    /**
     * @ignore
     * @private
     */
    _reset(): void;
    /**
     * @ignore
     * @param obj
     */
    notified(obj: any): void;
}
export {};
