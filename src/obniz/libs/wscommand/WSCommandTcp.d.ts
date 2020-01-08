// Type definitions for WSCommandTcp
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
import WSCommand from "./WSCommand";

declare namespace WSCommandTcp.prototype {
  // WSCommandTcp.prototype.connect.!0

  /**
   *
   */
  interface Connect0 {

    /**
     *
     */
    connect: {

      /**
       *
       */
      message: string;
    };
  }
}
declare namespace WSCommandTcp.prototype {
  // WSCommandTcp.prototype.notifyFromBinary.!0

  /**
   *
   */
  interface NotifyFromBinary0 {
  }
}

/**
 *
 */
export  default class WSCommandTcp extends WSCommand {
  public module: number;

  private _MaxPort: number;

  /**
   *
   */
  private _CommandConnect: number;

  /**
   *
   */
  private _CommandClose: number;

  /**
   * Notification
   */
  private _CommandConnection: number;

  /**
   *
   */
  private _CommandWrite: number;

  /**
   * Notification
   */
  private _CommandRead: number;

    /**
     *
     */
    public new(): WSCommandTcp;

    /**
     *
     * @param params
     * @param index
     */
    public connect(params: WSCommandTcp.prototype.Connect0, index: any): void;

    /**
     *
     * @param params
     * @param index
     */
    public disconnect(params: any, index: any): void;

    /**
     *
     * @param params
     * @param index
     */
    public  write(params: /* WSCommandTcp.prototype.+WSCommandTcp */ any, index: any): void;

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
    public notifyFromBinary(objToSend: WSCommandTcp.prototype.NotifyFromBinary0, func: any, payload: any): void;

}
