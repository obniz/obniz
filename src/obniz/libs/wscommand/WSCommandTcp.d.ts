// Type definitions for WSCommandTcp
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
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
declare interface WSCommandTcp {

  /**
   *
   */
  module: number;

  /**
   *
   */
  _MaxPort: number;

  /**
   *
   */
  _CommandConnect: number;

  /**
   *
   */
  _CommandClose: number;

  /**
   * Notification
   */
  _CommandConnection: number;

  /**
   *
   */
  _CommandWrite: number;

  /**
   * Notification
   */
  _CommandRead: number;

  /**
   *
   */
  Float32Array: {

    /**
     *
     */
    new(): WSCommandTcp;

    /**
     *
     * @param params
     * @param index
     */
    connect(params: WSCommandTcp.prototype.Connect0, index: any): void;

    /**
     *
     * @param params
     * @param index
     */
    disconnect(params: any, index: any): void;

    /**
     *
     * @param params
     * @param index
     */
    write(params: /* WSCommandTcp.prototype.+WSCommandTcp */ any, index: any): void;

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
    notifyFromBinary(objToSend: WSCommandTcp.prototype.NotifyFromBinary0, func: any, payload: any): void;

    /**
     *
     */
  };
}

declare module "WSCommandTcp" {

  export default WSCommandTcp;    // es6 style module export
}
