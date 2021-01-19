/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import semver from "semver";
import Obniz from "../../index";
import ObnizUtil from "../utils/util";

/**
 * @param PluginReceiveCallbackFunction.data
 * received data
 */
type PluginReceiveCallbackFunction = (data: number[], str: string | null) => void;

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
   * obniz.plugin.send("obniz.js send data")
   *
   * obniz.plugin.send([0x00, 0x01, 0x02])
   * ```
   *
   */
  public send(data: string | number | number[] | Buffer) {
    if (semver.lt(this.Obniz.firmware_ver!, "3.4.0")) {
      throw new Error(`Please update obniz firmware >= 3.4.0`);
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
      const string = ObnizUtil.dataArray2string(obj.receive);
      this.Obniz._runUserCreatedFunction(this.onreceive, obj.receive, string);
    }
  }
}
