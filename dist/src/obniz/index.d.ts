/**
 * @packageDocumentation
 * @module ObnizCore
 */
import ObnizApi from "./ObnizApi";
import ObnizUIs from "./ObnizUIs";
/**
 * @ignore
 */
declare global {
    var showObnizDebugError: any;
    var MozWebSocket: any;
    interface Window {
        userAppLoaded?: any;
        logger?: any;
        WebSocket: any;
        MozWebSocket: any;
    }
}
declare class Obniz extends ObnizUIs {
    /**
     *
     * @returns {ObnizApi}
     */
    static get api(): typeof ObnizApi;
    protected util: any;
    protected looper: any;
    protected repeatInterval: any;
    protected onmessage: any;
    protected ondebug: any;
    constructor(id: any, options?: any);
    repeat(callback: any, interval: any): void;
    warning(msg: any): void;
    error(msg: any): void;
    protected loop(): Promise<void>;
    protected _callOnConnect(): void;
    protected message(target: any, message: any): void;
    protected notifyToModule(obj: any): void;
}
export = Obniz;
