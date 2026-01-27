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
    /**
     * Callback function is called when Frame Information Received
     *
     * ```javascript
     * // Javascript Example
     * obniz.plugin.onFrameStart = (frame_id, length) => {
     *   console.log(`${length} bytes will be start`);
     * };
     * ```
     *
     */
    onFrameStart?: (frame_id: number, length: number) => void;
    /**
     * Callback function is called when Frame Information Received
     *
     * ```javascript
     * // Javascript Example
     * obniz.plugin.onFrameEnd = length => {
     *   console.log(`frame ended`);
     * };
     * ```
     *
     */
    onFrameEnd?: () => void;
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
     * Executing Lua on target device instantly.
     * Lua script never be saved on a device.
     *
     * ```javascript
     * // Javascript Example
     * obniz.plugin.execLua("duration = 60")
     * ```
     *
     */
    execLua(lua_script: string): void;
    /**
     * Executing Lua on target device and save to it's flash memory.
     *
     * ```javascript
     * // Javascript Example
     * obniz.storage.savePluginLua(`os.log("Hello World")`);
     * obniz.plugin.reloadLua();
     * ```
     *
     */
    reloadLua(): void;
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
