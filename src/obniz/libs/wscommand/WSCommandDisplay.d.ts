// Type definitions for WSCommandDisplay
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

import WSCommand from "./WSCommand";

/**
 *
 */
export default class WSCommandDisplay extends WSCommand {
  public module: number;

  /**
   *
   */
  public _CommandClear: number;

  /**
   *
   */
  public _CommandDrawCampusHorizonalBytes: number;

  /**
   *
   */
  private _CommandPrint: number;

  /**
   *
   */

  private _CommandDrawCampusVerticalBytes: number;

  /**
   *
   */

  private _CommandDrawIOState: number;

  /**
   *
   */
  private _CommandSetPinName: number;

  /**
   *
   */
  public new(): WSCommandDisplay;

  /**
   * Commands
   * @param params
   */
  public clear(params: any): void;

  /**
   *
   * @param buf
   */
  public print(buf: any): void;

  /**
   *
   * @param text
   */
  public printText(text: any): void;

  /**
   *
   * @param params
   */
  public text(params: /* WSCommandDisplay.prototype.+WSCommandDisplay */ any): void;

  /**
   *
   * @param params
   */
  public raw(params: any): void;

  /**
   *
   * @param params
   */
  public qr(params: any): void;

  /**
   *
   * @param params
   */
  public pinName(params: any): void;

  /**
   *
   * @param buf
   */
  public drawVertically(buf: any): void;

  /**
   *
   * @param buf
   */
  public drawHorizonally(buf: any): void;

  /**
   *
   * @param val
   */
  public drawIOState(val: any): void;

  /**
   *
   * @param no
   * @param moduleName
   * @param pinName
   */
  public setPinName(no: any, moduleName: any, pinName: any): void;

  /**
   *
   * @param json
   */
  public parseFromJson(json: any): void;

}
