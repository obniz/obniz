// Type definitions for WSCommandMeasurement
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

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
declare interface WSCommandMeasurement {

  /**
   *
   */
  new(): WSCommandMeasurement;

  /**
   * Commands
   * @param params
   */
  echo(params: any): void;

  /**
   *
   * @param json
   */
  parseFromJson(json: WSCommandMeasurement.prototype.ParseFromJson0): void;

  /**
   *
   * @param objToSend
   * @param func
   * @param payload
   */
  notifyFromBinary(objToSend: /* WSCommandMeasurement.prototype.parseFromJson.!0 */ any, func: any, payload: any): void;
}

declare module "WSCommandMeasurement" {

  export default WSCommandMeasurement;    // es6 style module export
}
