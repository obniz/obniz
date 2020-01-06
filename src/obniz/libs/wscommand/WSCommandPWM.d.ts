// Type definitions for WSCommandPWM
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace WSCommandPWM.prototype {
  // WSCommandPWM.prototype.init.!0

  /**
   *
   */
  interface Init0 {

    /**
     *
     */
    pulseUSec: number;
  }
}
declare namespace WSCommandPWM {
  // WSCommandPWM.pwms.<i>

  /**
   *
   */
  interface PwmsI {

    /**
     *
     */
    pulseUSec: number;
  }
}

/**
 *
 */
declare interface WSCommandPWM {

  /**
   *
   */
  module: number;

  /**
   *
   */
  ModuleNum: number;

  /**
   *
   */
  _CommandInit: number;

  /**
   *
   */
  _CommandDeinit: number;

  /**
   *
   */
  _CommandSetFreq: number;

  /**
   *
   */
  _CommandSetDuty: number;

  /**
   *
   */
  _CommandAMModulate: number;

  /**
   *
   */
  pwms: WSCommandPWM.PwmsI[];

  /**
   *
   */
  new(): WSCommandPWM;

  /**
   *
   */
  resetInternalStatus(): void;

  /**
   * Commands
   * @param params
   * @param module
   */
  init(params: WSCommandPWM.prototype.Init0, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  deinit(params: any, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  freq(params: /* WSCommandPWM.prototype.+WSCommandPWM */ any, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  pulse(params: any, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  amModulate(params: any, module: any): void;

  /**
   *
   * @param json
   */
  parseFromJson(json: any): void;
}

declare module "WSCommandPWM" {

  export default WSCommandPWM;    // es6 style module export
}
