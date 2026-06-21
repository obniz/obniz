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
interface LuaError {
    message: string;
}
/**
 * Handler called when Lua runs `cloud.transactionWait(data)` on the device.
 *
 * It receives the data sent from Lua and must return the result that will be
 * passed back to the waiting Lua coroutine. Returning normally is reported to
 * Lua as `success = true`; throwing (or rejecting) is reported as
 * `success = false` with the error message as the result.
 *
 * @param data raw bytes sent from Lua
 * @param str the same data decoded as a string
 */
declare type PluginCloudTransactionHandler = (data: number[], str: string) => string | number[] | Buffer | void | Promise<string | number[] | Buffer | void>;
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
    /**
     * Callback function is called when Frame Information Received
     *
     * ```javascript
     * // Javascript Example
     * obniz.plugin.onError = error => {
     *   console.log(`error occurred: ${error.message}`);
     * };
     * ```
     *
     */
    onError?: (error: LuaError) => void;
    /**
     * Handler called when Lua runs `cloud.transactionWait(data)` on the device.
     *
     * ```javascript
     * // Javascript Example
     * obniz.plugin.onCloudTransaction = async (data, str) => {
     *   // do something with the request from Lua and return the result
     *   return "result for lua";
     * };
     * ```
     *
     */
    onCloudTransaction?: PluginCloudTransactionHandler;
    private Obniz;
    private _callTransactionId;
    private _pendingCalls;
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
     * Executing Lua on target device and wait for its returned value.
     *
     * The Lua script is run inside a coroutine on the device. Whatever the script
     * `return`s (as a string) is resolved here. If the script raises an error, the
     * returned Promise is rejected with that error message.
     *
     * The Lua side may itself call `cloud.transactionWait(...)` while running,
     * which is delivered to {@link Plugin.onCloudTransaction}.
     *
     * ```javascript
     * // Javascript Example
     * const result = await obniz.plugin.callWait(`return "hello from lua"`);
     * console.log(result); // "hello from lua"
     * ```
     *
     * @param lua_script Lua script to be run on target device
     * @param timeout timeout in milliseconds (default 30000)
     */
    callWait(lua_script: string, timeout?: number): Promise<string>;
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
    private _getNextTransactionId;
    private _onCallResponse;
    private _handleCloudTransactionWait;
    private _transactionResultToString;
}
export {};
