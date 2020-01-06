// Type definitions for WSCommandSwitch
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
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
declare interface WSCommandSwitch {

  /**
   *
   */
  new(): WSCommandSwitch;

  /**
   * Commands
   * @param params
   */
  get(params: any): void;

  /**
   *
   * @param json
   */
  parseFromJson(json: WSCommandSwitch.prototype.ParseFromJson0): void;

  /**
   *
   * @param objToSend
   * @param func
   * @param payload
   */
  notifyFromBinary(objToSend: /* WSCommandSwitch.prototype.parseFromJson.!0 */ any, func: any, payload: any): void;
}

declare module "WSCommandSwitch" {

  export default WSCommandSwitch;    // es6 style module export
}
