// Type definitions for WSCommandSwitch
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
import WSCommand from "./WSCommand";

declare namespace WSCommandSwitch.prototype {
  // WSCommandSwitch.prototype.parseFromJson.!0

  /**
   *
   */
  interface ParseFromJson0 {

    /**
     *
     */
    switch: {

      /**
       *
       */
      state: string;

      /**
       *
       */
      action: string;
    };
  }
}

/**
 *
 */
export default class WSCommandSwitch extends WSCommand {
  protected module: number;

  /**
   *
   */
  public new(): WSCommandSwitch;

  /**
   * Commands
   * @param params
   */
  public get(params: any): void;

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
  public notifyFromBinary(objToSend: /* WSCommandSwitch.prototype.parseFromJson.!0 */ any, func: any, payload: any): void;
}
