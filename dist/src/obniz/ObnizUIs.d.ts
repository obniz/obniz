import ObnizSystemMethods from "./ObnizSystemMethods";
export default class ObnizUIs extends ObnizSystemMethods {
    constructor(id: any, options?: any);
    isValidObnizId(str: string): boolean | null;
    wsconnect(desired_server: any): void;
    showAlertUI(obj: any): void;
    getDebugDoms(): {
        loaderDom: any;
        debugDom: any;
        statusDom: any;
    } | undefined;
    _callOnConnect(): void;
    close(): void;
    _disconnectLocal(): void;
    updateOnlineUI(): void;
    showOnLine(isConnectedLocally: any): void;
    showOffLine(): void;
}
