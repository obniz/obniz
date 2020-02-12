/**
 * @packageDocumentation
 * @module ObnizCore
 */
import WSCommand from "./libs/wscommand";
export default class ObnizConnection {
    static get version(): any;
    static get WSCommand(): typeof WSCommand;
    debugprint: boolean;
    debugprintBinary: boolean;
    hw: any;
    firmware_ver: any;
    /**
     * @ignore
     */
    isNode: boolean;
    id: any;
    protected socket: any;
    protected socket_local: any;
    protected debugs: any;
    protected onConnectCalled: boolean;
    protected connectionState: "closed" | "connecting" | "connected" | "closing";
    protected bufferdAmoundWarnBytes: number;
    protected emitter: any;
    protected options: any;
    protected wscommand: any;
    protected wscommands: any;
    protected _sendQueueTimer: any;
    protected _sendQueue: any;
    protected _waitForLocalConnectReadyTimer: any;
    protected _connectionRetryCount: number;
    protected onopen: any;
    protected onclose: any;
    protected onconnect: any;
    protected sendPool: any;
    constructor(id: any, options?: any);
    prompt(filled: any, callback: any): void;
    wsOnOpen(): void;
    wsOnMessage(data: any): void;
    connectWait(option: any): Promise<unknown>;
    connect(): void;
    close(): void;
    send(obj: any, options?: any): void;
    warning(msg: any): void;
    error(msg: any): void;
    protected wsOnClose(event: any): void;
    protected _reconnect(): void;
    protected wsOnError(event: any): void;
    protected wsOnUnexpectedResponse(req: any, res?: any): void;
    protected wsconnect(desired_server?: any): void;
    protected _connectLocal(host: any): void;
    protected _disconnectLocal(): void;
    protected clearSocket(socket: any): void;
    protected _callOnConnect(): void;
    protected print_debug(str: any): void;
    protected _sendRouted(data: any): void;
    protected _drainQueued(): void;
    protected notifyToModule(obj: any): void;
    protected _canConnectToInsecure(): boolean;
    protected handleWSCommand(wsObj: any): void;
    protected handleSystemCommand(wsObj: any): void;
    protected binary2Json(binary: any): any;
}
