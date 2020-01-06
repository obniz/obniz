// Type definitions for WSCommandSystem
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace WSCommandSystem.prototype {
  // WSCommandSystem.prototype.parseFromJson.!0

  /**
   *
   */
  interface ParseFromJson0 {

    /**
     *
     */
    system: {

      /**
       *
       */
      pong: {

        /**
         *
         */
        pongServerTime: number;
      },
    };
  }
}

/**
 *
 */
declare interface WSCommandSystem {

  /**
   *
   */
  module: number;

  /**
   *
   */
  _CommandReboot: number;

  /**
   *
   */
  _CommandReset: number;

  /**
   *
   */
  _CommandSelfCheck: number;

  /**
   *
   */
  _CommandWait: number;

  /**
   *
   */
  _CommandResetOnDisconnect: number;

  /**
   *
   */
  _CommandPingPong: number;

  /**
   *
   */
  _CommandVCC: number;

  /**
   *
   */
  _CommandSleepSeconds: number;

  /**
   *
   */
  _CommandSleepMinute: number;

  /**
   *
   */
  _CommandSleepIoTrigger: number;

  /**
   *
   */
  new(): WSCommandSystem;

  /**
   * Commands
   * @param params
   */
  reboot(params: any): void;

  /**
   *
   * @param params
   */
  reset(params: any): void;

  /**
   *
   * @param params
   */
  selfCheck(params: any): void;

  /**
   *
   * @param params
   */
  wait(params: /* WSCommandSystem.prototype.+WSCommandSystem */ any): void;

  /**
   *
   * @param params
   */
  keepWorkingAtOffline(params: any): void;

  /**
   *
   * @param params
   */
  ping(params: any): void;

  /**
   *
   * @param mustReset
   */
  resetOnDisconnect(mustReset: boolean): void;

  /**
   *
   * @param json
   */
  parseFromJson(json: WSCommandSystem.prototype.ParseFromJson0): void;

  /**
   *
   * @param objToSend
   * @param payload
   */
  pong(objToSend: /* WSCommandSystem.prototype.parseFromJson.!0 */ any, payload: any): void;

  /**
   *
   * @param objToSend
   * @param func
   * @param payload
   */
  notifyFromBinary(objToSend: any, func: any, payload: any): void;

  /**
   *
   * @param params
   */
  sleepSeconds(params: any): void;

  /**
   *
   * @param params
   */
  sleepMinute(params: any): void;

  /**
   *
   * @param params
   */
  sleepIoTrigger(params: any): void;
}

declare module "WSCommandSystem" {

  export default WSCommandSystem;    // es6 style module export
}
