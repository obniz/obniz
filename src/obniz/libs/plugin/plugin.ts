/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import semver from "semver";
import Obniz from "../../index";

/**
 * @param PluginReceiveCallbackFunction.data
 * received data
 */
type PluginReceiveCallbackFunction = (data: number[]) => void;

export default class Plugin {
  /**
   * Callback function is called when Plugin is received.
   *
   * ```javascript
   * // Javascript Example
   * obniz.plugin.onreceive = data => {
   *   console.log(data);
   * };
   * ```
   *
   */
  public onreceive?: PluginReceiveCallbackFunction;

  private Obniz: Obniz;

  constructor(obniz: Obniz, id: number) {
    this.Obniz = obniz;
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
  public send(data: string | number | number[] | Buffer) {
    if (semver.lt(this.Obniz.firmware_ver!, "3.3.0")) {
      throw new Error(`Please update obniz firmware >= 3.3.0`);
    }

    let send_data: any = null;
    if (data === undefined) {
      return;
    }
    if (typeof data === "number") {
      data = [data];
    }
    if (this.Obniz.isNode && data instanceof Buffer) {
      send_data = [...data];
    } else if (data.constructor === Array) {
      send_data = data;
    } else if (typeof data === "string") {
      const buf: any = Buffer.from(data);
      send_data = [...buf];
    }

    this.Obniz.send({ plugin: { send: send_data } });
  }

  /**
   * @ignore
   * @private
   */
  public _reset() {}
  /**
   * @ignore
   * @param obj
   */
  public notified(obj: any) {
    if (obj.receive) {
      /* Connectino state update. response of connect(), close from destination, response from */
      if (this.onreceive) {
        this.onreceive(obj.receive);
      }
    }
  }
}
