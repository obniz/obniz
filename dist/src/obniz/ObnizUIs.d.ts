/**
 * @packageDocumentation
 * @module ObnizCore
 */
import ObnizSystemMethods from "./ObnizSystemMethods";
export default class ObnizUIs extends ObnizSystemMethods {
    constructor(id: any, options?: any);
    close(): void;
    protected isValidObnizId(str: string): boolean | null;
    protected wsconnect(desired_server: any): void;
    protected showAlertUI(obj: any): void;
    protected getDebugDoms(): {
        loaderDom: any;
        debugDom: any;
        statusDom: any;
    } | undefined;
    protected _callOnConnect(): void;
    protected _disconnectLocal(): void;
    protected updateOnlineUI(): void;
    protected showOnLine(isConnectedLocally: any): void;
    protected showOffLine(): void;
}
