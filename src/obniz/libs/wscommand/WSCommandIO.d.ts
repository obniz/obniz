// Type definitions for WSCommandIO
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
import WSCommand from "./WSCommand";

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
export default class WSCommandIO extends WSCommand {
  public module: number;

  /**
   *
   */
  public new(): WSCommandIO;

  /**
   * Commands
   * @param value
   * @param id
   */
  public output(value: any, id: any): void;

  /**
   *
   * @param params
   * @param id
   */
  public outputDetail(params: any, id: any): void;

  /**
   *
   * @param params
   * @param id
   */
  public input(params: any, id: any): void;

  /**
   *
   * @param params
   * @param id
   */
  public inputDetail(params: any, id: any): void;

  /**
   *
   * @param params
   * @param id
   * @return
   */
  public outputType(params: any, id: any): string;

  /**
   *
   * @param params
   * @param id
   * @return
   */
  public pullType(params: any, id: any): string;

  /**
   *
   * @param params
   * @param id
   */
  public deinit(params: any, id: any): void;

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
  public notifyFromBinary(objToSend: WSCommandIO.prototype.NotifyFromBinary0, func: any, payload: any): void;
}
