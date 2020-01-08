// Type definitions for WSCommandLogicAnalyzer
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
import WSCommand from "./WSCommand";

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
export default class WSCommandLogicAnalyzer extends WSCommand {
  public module: number;

  /**
   *
   */
  public new(): WSCommandLogicAnalyzer;

  /**
   * Commands
   * @param params
   */
  public init(params: any): void;

  /**
   *
   * @param params
   */
  public deinit(params: any): void;

  /**
   *
   * @param json
   */
  public parseFromJson(json: WSCommandLogicAnalyzer.prototype.ParseFromJson0): void;

  /**
   *
   * @param objToSend
   * @param func
   * @param payload
   */
  public notifyFromBinary(objToSend: /* WSCommandLogicAnalyzer.prototype.parseFromJson.!0 */ any, func: any, payload: any): void;
}
