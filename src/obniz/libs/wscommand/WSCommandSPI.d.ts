// Type definitions for WSCommandSPI
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
import WSCommand from "./WSCommand";

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
export default class WSCommandSPI extends WSCommand {
  protected module: number;
  /**
   *
   */
  public new(): WSCommandSPI;

  /**
   * Commands
   * @param params
   * @param module
   */
  public initMaster(params: any, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  public deinit(params: any, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  public write(params: any, module: any): void;

  /**
   *
   * @param json
   */
  public parseFromJson(json: any): void;

  /**
   *
   * @param objToSend
   * @param func
   * @param payload
   */
  public notifyFromBinary(objToSend: WSCommandSPI.prototype.NotifyFromBinary0, func: any, payload: any): void;
}
