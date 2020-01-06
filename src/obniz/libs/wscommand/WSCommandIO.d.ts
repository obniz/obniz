// Type definitions for WSCommandIO
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace WSCommandIO.prototype {
  // WSCommandIO.prototype.notifyFromBinary.!0

  /**
   *
   */
  interface NotifyFromBinary0 {
  }
}

/**
 *
 */
export declare var COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_HIGH: number;

/**
 *
 */
export declare var COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_LOW: number;

/**
 *
 */
export declare var COMMAND_IO_ERRORS_IO_TOO_LOW: number;

/**
 *
 */
export declare var COMMAND_IO_ERRORS_IO_TOO_HIGH: number;

/**
 *
 */
export declare var COMMAND_IO_ERRORS_IO_FORCE_RELEASED: number;

/**
 *
 */
declare var COMMAND_IO_ERROR_MESSAGES: {};

/**
 *
 */
declare var COMMAND_IO_MUTEX_NAMES: {};

/**
 *
 */
declare interface WSCommandIO {

  /**
   *
   */
  new(): WSCommandIO;

  /**
   * Commands
   * @param value
   * @param id
   */
  output(value: any, id: any): void;

  /**
   *
   * @param params
   * @param id
   */
  outputDetail(params: any, id: any): void;

  /**
   *
   * @param params
   * @param id
   */
  input(params: any, id: any): void;

  /**
   *
   * @param params
   * @param id
   */
  inputDetail(params: any, id: any): void;

  /**
   *
   * @param params
   * @param id
   * @return
   */
  outputType(params: any, id: any): string;

  /**
   *
   * @param params
   * @param id
   * @return
   */
  pullType(params: any, id: any): string;

  /**
   *
   * @param params
   * @param id
   */
  deinit(params: any, id: any): void;

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
  notifyFromBinary(objToSend: WSCommandIO.prototype.NotifyFromBinary0, func: any, payload: any): void;
}

declare module "WSCommandIO" {

  export default WSCommandIO;    // es6 style module export
}
