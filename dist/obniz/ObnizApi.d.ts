export = ObnizApi;
declare class ObnizApi {
    constructor(obnizId: any, options: any);
    id: any;
    options: {
        access_token: any;
        obniz_server: any;
    };
    urlBase: string;
    get apiVersion(): any;
    post(path: any, params: any, callback: any): any;
    getState(callback: any): any;
    postJson(json: any, callback: any): any;
}
