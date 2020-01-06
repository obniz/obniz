// Type definitions for WSCommandSPI
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace WSCommandSPI.prototype {
  // WSCommandSPI.prototype.notifyFromBinary.!0

  /**
   *
   */
  interface NotifyFromBinary0 {
  }
}

/**
 *
 */
declare interface WSCommandSPI {

  /**
   *
   */
  new(): WSCommandSPI;

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
  deinit(params: any, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  write(params: any, module: any): void;

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
  notifyFromBinary(objToSend: WSCommandSPI.prototype.NotifyFromBinary0, func: any, payload: any): void;
}

declare module "WSCommandSPI" {

  export default WSCommandSPI;    // es6 style module export
}
