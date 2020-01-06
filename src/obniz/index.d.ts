// Type definitions for index
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace Obniz.prototype {
  // Obniz.prototype.message.!0
  type Message0 = any[];
}
declare namespace Obniz.prototype {
  // Obniz.prototype.warning.!0

  /**
   *
   */
  interface Warning0 {

    /**
     *
     */
    alert: string;

    /**
     *
     */
    message: string;
  }
}

/**
 * global showObnizDebugError
 */
export declare var isNode: boolean;

/**
 *
 */
declare interface Obniz {

  /**
   *
   * @param id
   * @param options
   */
  new(id: any, options: any): Obniz;

  /**
   *
   * @param callback
   * @param interval
   */
  repeat(callback: any, interval: any): void;

  /**
   *
   */
  loop(): void;

  /**
   *
   */
  _callOnConnect(): void;

  /**
   *
   * @param target
   * @param message
   */
  message(target: Obniz.prototype.Message0, message: any): void;

  /**
   *
   * @param obj
   */
  notifyToModule(obj: any): void;

  /**
   *
   * @param msg
   */
  warning(msg: Obniz.prototype.Warning0): void;

  /**
   *
   * @param msg
   */
  error(msg: {} | string): void;
}

declare module "obniz" {

  export default obniz;    // es6 style module export
}
