export = ObnizUIs;
declare const ObnizUIs_base: any;
declare class ObnizUIs extends ObnizUIs_base {
    [x: string]: any;
    constructor(id: any, options: any);
    isValidObnizId(str: any): boolean | null;
    wsconnect(desired_server: any): void;
    showAlertUI(obj: any): void;
    getDebugDoms(): {
        loaderDom: Element | null;
        debugDom: Element | null;
        statusDom: Element | null;
    } | undefined;
    _callOnConnect(): void;
    close(): void;
    _disconnectLocal(): void;
    updateOnlineUI(): void;
    showOnLine(isConnectedLocally: any): void;
    showOffLine(): void;
}
