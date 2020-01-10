declare class ObnizApi {
    id: any;
    options: any;
    urlBase: any;
    constructor(obnizId: any, options: any);
    get apiVersion(): any;
    post(path: any, params: any, callback: any): Promise<unknown>;
    getState(callback: any): Promise<unknown>;
    postJson(json: any, callback: any): Promise<unknown>;
}
export default ObnizApi;
