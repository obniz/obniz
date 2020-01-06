// Type definitions for WSCommandAD
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace WSCommandAD.prototype {
  // WSCommandAD.prototype.notifyFromBinary.!0

  /**
   *
   */
  interface NotifyFromBinary0 {
  }
}

/**
 *
 */
declare interface WSCommandAD {

  /**
   *
   */
  new(): WSCommandAD;

  /**
   * Commands
   * @param params
   * @param no
   */
  get(params: any, no: any): void;

  /**
   *
   * @param params
   * @param no
   */
  deinit(params: any, no: any): void;

  /**
   *
   * @param json
   */
  parseFromJson(json: any): void;

  /**
   *
   * @param objToSend
   * @param func
   * @param payload
   */
  notifyFromBinary(objToSend: WSCommandAD.prototype.NotifyFromBinary0, func: any, payload: any): void;
}

declare module "WSCommandAD" {

  export default WSCommandAD;    // es6 style module export
}
