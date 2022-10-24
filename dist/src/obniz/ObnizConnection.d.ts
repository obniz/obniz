/**
 * @packageDocumentation
 * @module ObnizCore
 */
/// <reference types="node" />
/// <reference types="node" />
import EventEmitter from 'eventemitter3';
import wsClient from 'ws';
import { ObnizOptions } from './ObnizOptions';
import { WSCommandManager } from './libs/wscommand/WSCommandManager';
export declare type ObnizConnectionEventNames = 'connect' | 'close';
export interface ObnizErrorMessage {
    alert: 'warn' | 'error';
    message: string;
}
interface ConnectedNetworkWiFi {
    ssid: string;
    mac_address: string;
    rssi: number;
}
interface ConnectedNetworkWiFiMESH {
    meshid: string;
    parent_obniz_id?: string;
    root_obniz_id: string;
    layer: number;
    rssi: number;
}
export interface ConnectedNetwork {
    /**
     * Epoch Unix Timestamp (seconds) at device become online on the cloud
     */
    online_at: number;
    /**
     * Current connected network type. Defined in setting json
     */
    net?: string;
    /**
     * Local IP if exist
     */
    local_ip?: string;
    /**
     * Global IP if exist
     */
    global_ip?: string;
    /**
     * Wi-Fi information when net is wirelesslan
     */
    wifi?: ConnectedNetworkWiFi;
    /**
     * Wi-Fi MESH information when net is wifimesh
     */
    wifimesh?: ConnectedNetworkWiFiMESH;
}
/**
 * @ignore
 *
 */
declare type ObnizConnectionEventNamesInternal = '_close' | '_cloudConnectRedirect' | '_cloudConnectReady' | '_cloudConnectClose' | '_localConnectReady' | '_localConnectClose';
export declare abstract class ObnizConnection extends EventEmitter<ObnizConnectionEventNames | ObnizConnectionEventNamesInternal> {
    private _measureTraffic;
    /**
     * obniz.js version
     */
    static get version(): any;
    static isIpAddress(str: string): boolean;
    /**
     * This lets obniz.js to show logs like communicated jsons and connection logs in console.log.
     *
     * ```javascript
     * var obniz = new Obniz('1234-5678');
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
     * obniz.onconnect = async function() {
     *   console.log(obniz.metadata.description) // value for "description"
     * }
     * ```
     */
    metadata?: {
        [key: string]: string;
    };
    /**
     * Target obniz device's connected network information.
     * This could be changed when obniz device connect another netowrk.
     *
     * ```javascript
     * var obniz = new Obniz('1234-5678');
     * obniz.onconnect = async function() {
     *   console.log(obniz.connected_network.online_at) // online since in unix time.
     * }
     * ```
     */
    connected_network?: ConnectedNetwork;
    /**
     * Is node.js environment or not.
     *
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
    onloop?: (obniz: this) => void | Promise<void>;
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
    connectionState: 'closed' | 'connecting' | 'connected' | 'closing';
    protected socket: wsClient | null;
    protected socket_local: wsClient | null;
    protected bufferdAmoundWarnBytes: number;
    protected options: Required<ObnizOptions>;
    protected wsCommandManager: WSCommandManager;
    protected _sendQueueTimer: ReturnType<typeof setTimeout> | null;
    protected _sendQueue: Uint8Array[] | null;
    protected _waitForLocalConnectReadyTimer: ReturnType<typeof setTimeout> | null;
    protected _connectionRetryCount: number;
    private _sendPool;
    private _onConnectCalled;
    private _repeatInterval;
    private _isLoopProcessing;
    private _nextLoopTimeout;
    private _nextPingTimeout;
    private _nextAutoConnectLoopTimeout;
    private _lastDataReceivedAt;
    private _autoConnectTimeout?;
    private _localConnectIp;
    constructor(id: string, options?: ObnizOptions);
    get autoConnect(): boolean;
    set autoConnect(val: boolean);
    startCommandPool(): void;
    endCommandPool(): any[] | null;
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
    send(obj: Record<string, any> | Record<string, any>[], options?: {
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
    error(msg: ObnizErrorMessage | Error): void;
    /**
     * @ignore
     */
    log(...args: any[]): void;
    /**
     * @ignore
     * @private
     */
    _runUserCreatedFunction(func?: (..._args: any) => any, ...args: any[]): any;
    /**
     * Sets the execution interval of onLoop function.
     * Changes will be reflected after the next onloop is executed.
     *
     * @param interval interval of execution in milliseconds.
     */
    setLoopInterval(interval: number): void;
    /**
     * Set onloop function. Use onloop property instead. This is deprecated function.
     *
     * @param callback
     * @param interval  default 100. It mean 100ms interval loop.
     * @deprecated
     */
    repeat(callback: any, interval?: number): void;
    abstract pingWait(unixtime?: number, rand?: number, forceGlobalNetwork?: boolean): Promise<void>;
    protected _close(): void;
    protected wsOnOpen(): void;
    protected wsOnMessage(data: string | Buffer | ArrayBuffer | Buffer[]): void;
    protected wsOnClose(event: any): void;
    protected wsOnError(event: any): void;
    protected wsOnUnexpectedResponse(req: any, res?: any): void;
    protected tryWsConnectOnceWait(desired_server?: string): Promise<void>;
    protected _connectCloudWait(desired_server?: string): Promise<void>;
    protected _createCloudSocket(url: string): wsClient;
    protected _connectLocalWait(): Promise<unknown> | undefined;
    protected _disconnectLocal(): void;
    protected _disconnectCloudRequest(): void;
    protected _disconnectCloud(notify?: boolean): void;
    protected _clearSocket(socket: wsClient): void;
    /**
     * This function will be called before obniz.onconnect called;
     */
    protected _beforeOnConnect(): void;
    protected _callOnConnect(): void;
    protected _print_debug(str: any): void;
    protected _sendRouted(data: any): void;
    protected _drainQueued(): void;
    protected _notifyToModule(obj: any): void;
    protected _canConnectToInsecure(): boolean;
    protected _handleWSCommand(wsObj: any): void;
    protected _handleSystemCommand(wsObj: any): void;
    private _startLoopInBackgroundWait;
    private _stopLoopInBackground;
    private _startAutoConnectLoopInBackground;
    private _stopAutoConnectLoopInBackground;
    private _startPingLoopInBackground;
    _stopPingLoopInBackground(): void;
    protected throwErrorIfOffline(): void;
    startTrafficMeasurement(ceil?: number): void;
    getTrafficData(): {
        readByte: number;
        readCount: number;
        sendByte: number;
        sendCount: number;
        ceilByte: number;
    };
    resetTrafficMeasurement(): {
        readByte: number;
        readCount: number;
        sendByte: number;
        sendCount: number;
        ceilByte: number;
    } | null;
    endTrafficMeasurement(): {
        readByte: number;
        readCount: number;
        sendByte: number;
        sendCount: number;
        ceilByte: number;
    };
    private _calcTrafficSize;
}
export {};
