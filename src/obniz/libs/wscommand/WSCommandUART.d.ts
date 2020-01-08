// Type definitions for WSCommandUart
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
import WSCommand from "./WSCommand";

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
export default class WSCommandUart extends WSCommand {
  public module: number;

  /**
   *
   */
  public new(): WSCommandUart;

  /**
   * Commands
   * @param params
   * @param module
   */
  public init(params: any, module: any): void;

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
  public send(params: WSCommandUart.prototype.Send0, module: any): void;

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
  public notifyFromBinary(objToSend: WSCommandUart.prototype.NotifyFromBinary0, func: any, payload: any): void;
}
