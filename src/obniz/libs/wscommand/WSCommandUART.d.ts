// Type definitions for WSCommandUart
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace WSCommandUart.prototype {
  // WSCommandUart.prototype.send.!0

  /**
   *
   */
  interface Send0 {

    /**
     *
     */
    data: any[];
  }
}
declare namespace WSCommandUart.prototype {
  // WSCommandUart.prototype.notifyFromBinary.!0

  /**
   *
   */
  interface NotifyFromBinary0 {
  }
}

/**
 *
 */
declare interface WSCommandUart {

  /**
   *
   */
  new(): WSCommandUart;

  /**
   * Commands
   * @param params
   * @param module
   */
  init(params: any, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  deinit(params: any, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  send(params: WSCommandUart.prototype.Send0, module: any): void;

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
  notifyFromBinary(objToSend: WSCommandUart.prototype.NotifyFromBinary0, func: any, payload: any): void;
}

declare module "WSCommandUart" {

  export default WSCommandUart;    // es6 style module export
}
