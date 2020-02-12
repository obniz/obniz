/**
 * @packageDocumentation
 * @module ObnizCore
 */
export default class ObnizApi {
    get apiVersion(): any;
    options: any;
    urlBase: any;
    private id;
    constructor(obnizId: string, options: any);
    post(path: any, params: any, callback: any): Promise<unknown>;
    getState(callback: any): Promise<unknown>;
    postJson(json: any, callback: any): Promise<unknown>;
}
