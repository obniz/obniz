// Type definitions for WSCommandI2C
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace WSCommandI2C.prototype {
  // WSCommandI2C.prototype.notifyFromBinary.!0

  /**
   *
   */
  interface NotifyFromBinary0 {
  }
}

/**
 *
 */
declare interface WSCommandI2C {

  /**
   *
   */
  new(): WSCommandI2C;

  /**
   * Commands
   * @param params
   * @param module
   */
  initMaster(params: any, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  initSlave(params: any, module: any): void;

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
  write(params: any, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  read(params: any, module: any): void;

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
  notifyFromBinary(objToSend: WSCommandI2C.prototype.NotifyFromBinary0, func: any, payload: any): void;
}

declare module "WSCommandI2C" {

  export default WSCommandI2C;    // es6 style module export
}
