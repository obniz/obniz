/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import semver from "semver";
import Obniz from "../../index";

export default class WiFi {
  private Obniz: Obniz;
  private connectObservers: any;

  constructor(obniz: Obniz, id: number) {
    this.Obniz = obniz;
    this._reset();
  }

  /**
   * Scan WiFi
   *
   * ```javascript
   * // Javascript Example
   * console.log(await obniz.wifi.scanWait());
   * ```
   *
   */
  public scanWait(): Promise<any> {
    if (semver.lt(this.Obniz.firmware_ver!, "3.3.0")) {
      throw new Error(`Please update obniz firmware >= 3.3.0`);
    }

    this.connectObservers = [];
    return new Promise((resolve: any, reject: any) => {
      this._addConnectObserver(resolve);
      this.Obniz.send({ wifi: { scan: true } });
    });
  }

  /**
   *
   * ```javascript
   * // Javascript Example
   * obniz.wifi.end();
   * ```
   */
  public end() {
    this._reset();
  }

  /**
   * @ignore
   * @param obj
   */
  public notified(obj: any) {
    if (obj.scan) {
      /* Connectino state update. response of connect(), close from destination, response from */
      const callback: any = this.connectObservers.shift();
      if (callback) {
        callback(obj.scan);
      }
    }
  }

  private _reset() {
    this.connectObservers = [];
  }

  private _addConnectObserver(callback: any) {
    if (callback) {
      this.connectObservers.push(callback);
    }
  }
}
