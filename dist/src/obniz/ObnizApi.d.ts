declare class ObnizApi {
    id: any;
    options: any;
    urlBase: any;
    constructor(obnizId: any, options: any);
    readonly apiVersion: any;
    post(path: any, params: any, callback: any): Promise<{}>;
    getState(callback: any): Promise<{}>;
    postJson(json: any, callback: any): Promise<{}>;
}
export default ObnizApi;
