// Type definitions for WSCommandAD
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
import WSCommand from "./WSCommand";

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
export default class WSCommandAD extends WSCommand {
  public module: number;

  /**
   *
   */
  public new(): WSCommandAD;

  /**
   * Commands
   * @param params
   * @param no
   */
  public get(params: any, no: any): void;

  /**
   *
   * @param params
   * @param no
   */
  public deinit(params: any, no: any): void;

  /**
   *
   * @param json
   */
  public  parseFromJson(json: any): void;

  /**
   *
   * @param objToSend
   * @param func
   * @param payload
   */
  public notifyFromBinary(objToSend: WSCommandAD.prototype.NotifyFromBinary0, func: any, payload: any): void;
}
