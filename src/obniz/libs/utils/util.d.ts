// Type definitions for util
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace ObnizUtil {
  // ObnizUtil.string2dataArray.!ret
  type String2dataArrayRet = any[];
}

/**
 *
 */
declare interface ObnizUtil {

  /**
   *
   * @param obniz
   */
  new(obniz: any): ObnizUtil;

  /**
   *
   * @param width
   * @param height
   */
  createCanvasContext(width: any, height: any): void;

  /**
   *
   * @param params
   * @param keys
   * @return
   */
  _keyFilter(params: any, keys: any): any;

  /**
   *
   * @param params
   * @param keys
   * @return
   */
  _requiredKeys(params: any, keys: any): any;

  /**
   *
   * @param data
   */
  dataArray2string(data: any): void;

  /**
   *
   * @param str
   * @return
   */
  string2dataArray(str: any): ObnizUtil.String2dataArrayRet;
}

declare module "util" {

  export default util;    // es6 style module export
}
