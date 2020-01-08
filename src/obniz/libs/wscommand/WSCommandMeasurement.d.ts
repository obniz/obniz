// Type definitions for WSCommandMeasurement
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

import WSCommand from "./WSCommand";

declare namespace WSCommandMeasurement.prototype.Echo0 {
  // WSCommandMeasurement.prototype.echo.!0.echo.<i>

  /**
   *
   */
  interface EchoI {

    /**
     *
     */
    edge: boolean;

    /**
     *
     */
    timing: number;
  }
}
declare namespace WSCommandMeasurement.prototype {
  // WSCommandMeasurement.prototype.parseFromJson.!0

  /**
   *
   */
  interface ParseFromJson0 {

    /**
     *
     */
    measure: /* WSCommandMeasurement.prototype.echo.!0 */ any;
  }
}

/**
 *
 */
export  default  class WSCommandMeasurement extends WSCommand {
  public module: number;

  /**
   *
   */
  public new(): WSCommandMeasurement;

  /**
   * Commands
   * @param params
   */
  public echo(params: any): void;

  /**
   *
   * @param json
   */
  public parseFromJson(json: WSCommandMeasurement.prototype.ParseFromJson0): void;

  /**
   *
   * @param objToSend
   * @param func
   * @param payload
   */
  public notifyFromBinary(objToSend: /* WSCommandMeasurement.prototype.parseFromJson.!0 */ any, func: any, payload: any): void;
}
