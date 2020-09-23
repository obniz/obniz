/**
 * @packageDocumentation
 * @module ObnizApp
 */

declare var done: any;
declare var req: any;
declare var configs: any;

export default class ObnizApp {
  /**
   * Determine obniz.js is running on obniz Cloud or not.
   */
  public static isCloudRunning(): boolean {
    return typeof done === "function";
  }

  /**
   * request object on obniz Cloud execution for webhook call.
   *
   * ```javascript
   * // JavaScript example
   * const req = Obniz.App.req();
   * console.log(req.query);
   * console.log(req.body);
   * ```
   *
   */
  public static req(): any {
    if (this.isCloudRunning()) {
      return req;
    }
    return null;
  }

  /**
   * done call for obniz Cloud execution.
   * Pass arguemnt for update cloud execution status.
   *
   * ```javascript
   * // JavaScript example
   * Obniz.App.done({
   *   status: 'success',  // or 'error'
   *   text: 'ex. Door Opened'
   * });
   * ```
   *
   */
  public static done(arg: any) {
    if (this.isCloudRunning()) {
      return done(arg);
    } else {
      console.error(`This program is not running on obniz Cloud.`);
    }
  }

  /**
   * Configration by user for This App. Only Available for BrowserApp
   */
  public static configs(): any {
    if (typeof configs === "object") {
      return configs;
    } else {
      return null;
    }
  }
}
