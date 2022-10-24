/**
 * @packageDocumentation
 * @module ObnizCore
 */
import { ObnizOptions } from './ObnizOptions';
import { ObnizSystemMethods } from './ObnizSystemMethods';
export declare class ObnizUIs extends ObnizSystemMethods {
    /**
     * @ignore
     */
    static _promptQueue: any[];
    /**
     * @ignore
     */
    static _promptWaiting: boolean;
    /**
     * @ignore
     */
    static _promptCount: number;
    static isValidObnizId(str: string): boolean;
    constructor(id: string, options?: ObnizOptions);
    protected _close(): void;
    protected tryWsConnectOnceWait(desired_server?: string): Promise<void>;
    protected prompt(filled: string | undefined, callback: any): void;
    protected _promptNext(): void;
    protected _promptOne(filled: any, callback: any): void;
    protected showAlertUI(obj: any): void;
    protected getDebugDoms(): {
        loaderDom: Element | null;
        debugDom: Element | null;
        statusDom: any;
    } | undefined;
    protected _callOnConnect(): void;
    protected _disconnectLocal(): void;
    protected updateOnlineUI(): void;
    protected showOnLine(isConnectedLocally: any): void;
    protected showOffLine(): void;
}
