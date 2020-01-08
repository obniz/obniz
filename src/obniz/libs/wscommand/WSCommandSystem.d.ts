// Type definitions for WSCommandSystem
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
import WSCommand from "./WSCommand";

/**
 *
 */
export default class WSCommandSystem extends WSCommand {
  protected module: number;
  /**
   *
   */
  private  _CommandReboot: number;

  /**
   *
   */
  private _CommandReset: number;

  /**
   *
   */
  private _CommandSelfCheck: number;

  /**
   *
   */
  private _CommandWait: number;

  /**
   *
   */
  private _CommandResetOnDisconnect: number;

  /**
   *
   */
  private _CommandPingPong: number;

  /**
   *
   */
  private _CommandVCC: number;

  /**
   *
   */
  private _CommandSleepSeconds: number;

  /**
   *
   */
  private _CommandSleepMinute: number;

  /**
   *
   */
  private _CommandSleepIoTrigger: number;

  /**
   *
   */
  public new(): WSCommandSystem;

  /**
   * Commands
   * @param params
   */
  public reboot(params: any): void;

  /**
   *
   * @param params
   */
  public reset(params: any): void;

  /**
   *
   * @param params
   */
  public  selfCheck(params: any): void;

  /**
   *
   * @param params
   */
  public wait(params: /* WSCommandSystem.prototype.+WSCommandSystem */ any): void;

  /**
   *
   * @param params
   */
  public keepWorkingAtOffline(params: any): void;

  /**
   *
   * @param params
   */
  public  ping(params: any): void;

  /**
   *
   * @param mustReset
   */
  public resetOnDisconnect(mustReset: boolean): void;

  /**
   *
   * @param json
   */
  public parseFromJson(json: any): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  public pong(objToSend: /* WSCommandSystem.prototype.parseFromJson.!0 */ any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param func
   * @param payload
   */
  public notifyFromBinary(objToSend: any, func: any, payload: any): void;

  /**
   *
   * @param params
   */
  public sleepSeconds(params: any): void;

  /**
   *
   * @param params
   */
  public sleepMinute(params: any): void;

  /**
   *
   * @param params
   */
  public sleepIoTrigger(params: any): void;

}
