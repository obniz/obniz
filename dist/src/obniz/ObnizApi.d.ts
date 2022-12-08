/**
 * @packageDocumentation
 * @module ObnizCore
 */
import { ObnizOptions } from './ObnizOptions';
export declare class ObnizApi {
    /**
     * obniz.js major version string
     */
    get apiVersion(): string;
    options: any;
    urlBase: any;
    private id;
    constructor(obnizId: string, options?: ObnizOptions);
    /**
     * Get device is online or offline
     *
     * @param callback with result
     */
    getState(callback: (val: {
        state: 'online' | 'offline';
    }) => void): Promise<any>;
    /**
     * Get device is online or offline
     */
    getStateWait(): Promise<{
        state: 'online' | 'offline';
    }>;
    /**
     * post data via obniz REST api
     *
     * @param json
     * @param callback
     */
    postJsonWait(json: any, callback: (result: any) => void): Promise<any>;
    protected postWait(path: string, params: any, callback?: any): Promise<any>;
    protected get(path: any, callback: any): Promise<unknown>;
}
