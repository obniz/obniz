// Type definitions for WSCommandLogicAnalyzer
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace WSCommandLogicAnalyzer.prototype {
  // WSCommandLogicAnalyzer.prototype.parseFromJson.!0

  /**
   *
   */
  interface ParseFromJson0 {

    /**
     *
     */
    logic_analyzer: {

      /**
       *
       */
      data: number[];
    };
  }
}

/**
 *
 */
declare interface WSCommandLogicAnalyzer {

  /**
   *
   */
  new(): WSCommandLogicAnalyzer;

  /**
   * Commands
   * @param params
   */
  init(params: any): void;

  /**
   *
   * @param params
   */
  deinit(params: any): void;

  /**
   *
   * @param json
   */
  parseFromJson(json: WSCommandLogicAnalyzer.prototype.ParseFromJson0): void;

  /**
   *
   * @param objToSend
   * @param func
   * @param payload
   */
  notifyFromBinary(objToSend: /* WSCommandLogicAnalyzer.prototype.parseFromJson.!0 */ any, func: any, payload: any): void;
}

declare module "WSCommandLogicAnalyzer" {

  export default WSCommandLogicAnalyzer;    // es6 style module export
}
