// Type definitions for WSCommandPWM
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
import WSCommand from "./WSCommand";

/**
 *
 */
export default class WSCommandPWM extends WSCommand {
  public ModuleNum: number;

  /**
   *
   */
  public pwms: any;
  protected module: number;

  /**
   *
   */
  private _CommandInit: number;

  /**
   *
   */
  private _CommandDeinit: number;

  /**
   *
   */
  private _CommandSetFreq: number;

  /**
   *
   */
  private _CommandSetDuty: number;

  /**
   *
   */
  private _CommandAMModulate: number;

  /**
   *
   */
  public new(): WSCommandPWM;

  /**
   *
   */
  public resetInternalStatus(): void;

  /**
   * Commands
   * @param params
   * @param module
   */
  public init(params: any, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  public deinit(params: any, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  public freq(params: /* WSCommandPWM.prototype.+WSCommandPWM */ any, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  public pulse(params: any, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  public amModulate(params: any, module: any): void;

  /**
   *
   * @param json
   */
  public parseFromJson(json: any): void;
}
