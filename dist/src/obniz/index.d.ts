import ObnizApi from "./ObnizApi";
import ObnizUIs from "./ObnizUIs";
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
    util: any;
    looper: any;
    repeatInterval: any;
    onConnectCalled: any;
    send: any;
    onmessage: any;
    ondebug: any;
    isNode: any;
    showAlertUI: any;
    constructor(id: any, options: any);
    repeat(callback: any, interval: any): void;
    loop(): Promise<void>;
    _callOnConnect(): void;
    message(target: any, message: any): void;
    notifyToModule(obj: any): void;
    warning(msg: any): void;
    error(msg: any): void;
    /**
     *
     * @returns {ObnizApi}
     */
    static get api(): typeof ObnizApi;
}
export = Obniz;
