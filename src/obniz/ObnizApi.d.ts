// Type definitions for ObnizApi
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 *
 */
declare interface ObnizApi {

  /**
   *
   * @param obnizId
   * @param options
   */
  new(obnizId: any, options: any): ObnizApi;

  /**
   *
   * @param path
   * @param params
   * @param callback
   */
  post(path: string, params: any, callback: any): void;

  /**
   *
   * @param callback
   */
  getState(callback: any): void;

  /**
   *
   * @param json
   * @param callback
   */
  postJson(json: any, callback: any): void;
}

declare module "ObnizApi" {

  export default ObnizApi;    // es6 style module export
}
