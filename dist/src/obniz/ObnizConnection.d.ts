/**
 * @packageDocumentation
 * @module ObnizCore
 */
import EventEmitter from "eventemitter3";
import WSCommand from "./libs/wscommand";
import { ObnizOptions } from "./ObnizOptions";
export declare type ObnizConnectionEventNames = "connect" | "close" | "notify";
/**
 * @ignore
 *
 */
declare type ObnizConnectionEventNamesInternal = "_close";
export default abstract class ObnizConnection extends EventEmitter<ObnizConnectionEventNames | ObnizConnectionEventNamesInternal> {
    /**
     * obniz.js version
     */
    static get version(): any;
    /**
     * @ignore
     * @constructor
     */
    static get WSCommand(): typeof WSCommand;
    static isIpAddress(str: string): boolean;
    /**
     * This lets obniz.js to show logs like communicated jsons and connection logs in console.log.
     *
     * ```javascript
     * var obniz = new Obniz('1234-5678');
     * obniz.debugprint = true
     * obniz.onconnect = async function() {
     *  obniz.io0.output(true);
     * }
     * ```
     */
    debugprint: boolean;
    /**
     * @ignore
     */
    debugprintBinary: boolean;
    /**
     * This variable indicate connected hardware identifier of target device
     *
     * ```javascript
     * var obniz = new Obniz('1234-5678');
     * obniz.debugprint = true
     * obniz.onconnect = async function() {
     *   console.log(obniz.hw) // ex. "obnizb1"
     * }
     * ```
     */
    hw?: string;
    /**
     * This variable indicate installed firmware version of target device
     *
     * ```javascript
     * var obniz = new Obniz('1234-5678');
     * obniz.debugprint = true
     * obniz.onconnect = async function() {
     *   console.log(obniz.firmware_ver) // ex. "2.0.0"
     * }
     * ```
     */
    firmware_ver?: string;
    /**
     * Device metadata set on obniz cloud.
     *
     * ```javascript
     * var obniz = new Obniz('1234-5678');
     * obniz.debugprint = true
     * obniz.onconnect = async function() {
     *   console.log(obniz.metadata.description) // value for "description"
     * }
     * ```
     */
    metadata?: {
        [key: string]: string;
    };
    /**
     * Is node.js environment or not.
     * @readonly
     */
    isNode: boolean;
    /**
     * obniz id
     */
    id: string;
    /**
     * @ignore
     */
    onopen?: (obniz: this) => void;
    /**
     * onclose will be called when disconnected.
     *
     * ```javascript
     * var obniz = new Obniz('1234-5678');
     * obniz.onconnect = async function() {
     *
     * }
     * obniz.onclose = async function() {
     *
     * }
     * ```
     */
    onclose?: (obniz: this) => void;
    /**
     * Once connection is established, onconnect function will be called.
     *
     * ```javascript
     * var obniz = new Obniz('1234-5678');
     * obniz.onconnect = async function() {
     *
     * }
     * ```
     *
     * Operations like turning on/off an io becomes possible only after connection is established,
     * so any operations you want obniz Board to undertake must be written in onconnect
     *
     * ```javascript
     * var obniz = new Obniz('1234-5678');
     * obniz.onconnect = async function() {
     *   obniz.io0.output(true);
     * }
     * ```
     */
    onconnect?: (obniz: this) => void;
    /**
     * Called continuously while obniz device is online.
     * Put your main code inside of onloop and put your setup code inside of onconnect.
     *
     * onloop will be called after onconnect called. If your funciton set to onconnect return promise, onloop wait until done promise. Even onconnect throws an error onloop will start.
     *
     * onloop call `pingWait()` every time to keep connection data buffer between device to your software clean.
     *
     * ```javascript
     * var obniz = new Obniz('1234-5678');
     * obniz.onconnect = async function() {
     *
     * }
     * obniz.onloop = async function() {
     *
     * }
     * ```
     *
     */
    onloop?: (obniz: this) => void;
    /**
     * If an error occurs, the onerror function is called.
     *
     * ```javascript
     * var obniz = new Obniz('1234-5678');
     * obniz.onconnect = async function() {
     *
     * }
     * obniz.onerror = async function(ob, error) {
     *    console.error(error);
     * }
     * ```
     */
    onerror?: (obniz: this, error: Error) => void;
    /**
     * This let you know connection state to your obniz Board as string value.
     *
     * - 'closed' : not connected.
     * - 'connecting' : connecting
     * - 'connected' : connection established
     * - 'closing' : closing connection.
     *
     * ```javascript
     * var obniz = new Obniz('1234-5678');
     * console.log(obniz.connectionState) // => === "connecting"
     * obniz.onconnect = async function() {
     *  console.log(obniz.connectionState) // => === "connected"
     * }
     * ```
     *
     *
     */
    connectionState: "closed" | "connecting" | "connected" | "closing";
    protected _userManualConnectionClose: boolean;
    protected socket: any;
    protected socket_local: any;
    protected debugs: any;
    protected bufferdAmoundWarnBytes: number;
    protected options: any;
    protected wscommand: any;
    protected wscommands: any;
    protected _sendQueueTimer: any;
    protected _sendQueue: any;
    protected _waitForLocalConnectReadyTimer: any;
    protected _connectionRetryCount: number;
    protected sendPool: any;
    private _onConnectCalled;
    private _repeatInterval;
    private _nextLoopTimeout?;
    private _nextPingTimeout?;
    private _lastDataReceivedAt;
    private _autoConnectTimeout?;
    constructor(id: string, options?: ObnizOptions);
    /**
     * With this you wait until the connection to obniz Board succeeds.
     *
     * ```javascript
     * var obniz = new Obniz('1234-5678');
     *
     * await obniz.connectWait();
     *
     * obniz.io0.output(true);
     * await obniz.closeWait();
     *
     * ```
     *
     *
     * - with timeout
     *
     * ```javascript
     * var obniz = new Obniz('1234-5678');
     *
     * await obniz.connectWait({timeout:10});  //timeout 10sec
     *
     * if(connected){
     *    obniz.io0.output(true);
     *    await obniz.closeWait();
     * }
     * ```
     *
     * - with auto_connect:false
     *
     * If the param auto_connect is set as false, it will try to connect only once and, if unsuccessful, return false.
     *
     * ```javascript
     * var obniz = new Obniz('1234-5678',{auto_connect: false});
     *
     * var connected = await obniz.connectWait();  //try once
     *
     * if(connected){
     *   obniz.io0.output(true);
     *   await obniz.closeWait();
     * }
     * ```
     *
     * @param option.timeout timeout in seconds
     * @return False will be returned when connection is not established within a set timeout.
     */
    connectWait(option?: {
        timeout?: number;
    }): Promise<boolean>;
    /**
     * You can connect to obniz Board manually by calling connect() when auto_connect is set to be false.
     *
     * ```javascript
     * var obniz = new Obniz('1234-5678', { auto_connect: false });
     *
     * obniz.connect();
     * obniz.onconnect = async function() {
     *  obniz.io0.output(true);
     * }
     * ```
     */
    connect(): void;
    /**
     * This closes the current connection.
     * You need to set auto_connect to false. Otherwise the connection will be recovered.
     *
     * ```javascript
     * var obniz = new Obniz('1234-5678', {
     *   auto_connect: false,
     *   reset_obniz_on_ws_disconnection: false
     * });
     *
     * obniz.connect();
     * obniz.onconnect = async function() {
     *   obniz.io0.output(true);
     *   obniz.close();
     * }
     * ```
     *
     * @deprecated replace with {@link closeWait}
     */
    close(): void;
    /**
     * This closes the current connection.
     * You need to set auto_connect to false. Otherwise the connection will be recovered.
     *
     * ```javascript
     * var obniz = new Obniz('1234-5678', {
     *   auto_connect: false,
     *   reset_obniz_on_ws_disconnection: false
     * });
     *
     * obniz.connect();
     * obniz.onconnect = async function() {
     *   obniz.io0.output(true);
     *   await obniz.closeWait();
     * }
     * ```
     *
     */
    closeWait(): Promise<void>;
    /**
     * Send json/binary data to obniz Cloud or device.
     *
     * @param obj send data
     * @param options send option
     * @param options.local_connect If false, send data via gloval internet.
     */
    send(obj: object | object[], options?: {
        local_connect?: boolean;
        connect_check?: boolean;
    }): void;
    /**
     * @ignore
     * @param msg
     */
    warning(msg: any): void;
    /**
     * @ignore
     * @param msg
     */
    error(msg: any): void;
    /**
     * @ignore
     */
    log(...args: any[]): void;
    /**
     * @ignore
     * @private
     */
    _runUserCreatedFunction(func?: (...args: any) => any, ...args: any[]): void;
    /**
     * Set onloop function. Use onloop property instead. This is deprecated function.
     *
     * @param callback
     * @param interval  default 100. It mean 100ms interval loop.
     * @deprecated
     */
    repeat(callback: any, interval?: any): void;
    abstract pingWait(unixtime?: number, rand?: number, forceGlobalNetwork?: boolean): Promise<void>;
    protected _close(): void;
    protected wsOnOpen(): void;
    protected wsOnMessage(data: any): void;
    protected wsOnClose(event: any): void;
    protected _reconnect(): void;
    protected wsOnError(event: any): void;
    protected wsOnUnexpectedResponse(req: any, res?: any): void;
    protected wsconnect(desired_server?: string): void;
    protected _connectLocal(host: any): void;
    protected _disconnectLocal(): void;
    protected clearSocket(socket: any): void;
    /**
     * This function will be called before obniz.onconnect called;
     */
    protected _beforeOnConnect(): void;
    protected _callOnConnect(): void;
    protected print_debug(str: any): void;
    protected _sendRouted(data: any): void;
    protected _drainQueued(): void;
    protected notifyToModule(obj: any): void;
    protected _canConnectToInsecure(): boolean;
    protected handleWSCommand(wsObj: any): void;
    protected handleSystemCommand(wsObj: any): void;
    protected binary2Json(binary: any): any;
    private _startLoopInBackground;
    private _stopLoopInBackground;
    private _startPingLoopInBackground;
}
export {};
