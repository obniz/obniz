/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import semver from 'semver';
import Obniz from '../../index';
import { ObnizUtil } from '../utils/util';

/**
 * @param PluginReceiveCallbackFunction.data
 * received data
 */
type PluginReceiveCallbackFunction = (
  data: number[],
  str: string | null
) => void;

export class Plugin {
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

  /**
   * Callback function is called when Frame Information Received
   *
   * ```javascript
   * // Javascript Example
   * obniz.plugin.onFrameStart = (frame_id, length) => {
   *   console.log(`${length} bytes will be start`);
   * };
   * ```
   *
   */
  public onFrameStart?: (frame_id: number, length: number) => void;

  /**
   * Callback function is called when Frame Information Received
   *
   * ```javascript
   * // Javascript Example
   * obniz.plugin.onFrameEnd = length => {
   *   console.log(`frame ended`);
   * };
   * ```
   *
   */
  public onFrameEnd?: () => void;

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
    if (semver.lt(this.Obniz.firmware_ver!, '3.4.0')) {
      throw new Error(`Please update obniz firmware >= 3.4.0`);
    }

    let send_data = null;
    if (data === undefined) {
      return;
    }
    if (typeof data === 'number') {
      data = [data];
    }
    if (this.Obniz.isNode && data instanceof Buffer) {
      send_data = [...data];
    } else if (data.constructor === Array) {
      send_data = data;
    } else if (typeof data === 'string') {
      const buf = Buffer.from(data);
      send_data = [...buf];
    }

    this.Obniz.send({ plugin: { send: send_data } });
  }

  /**
   * Executing Lua on target device instantly.
   * Lua script never be saved on a device.
   *
   * ```javascript
   * // Javascript Example
   * obniz.plugin.execLua("duration = 60")
   * ```
   *
   */
  public execLua(lua_script: string) {
    if (semver.major(this.Obniz.firmware_ver!) < 7) {
      throw new Error(`Please update obniz firmware >= 7.0.0`);
    }

    if (typeof lua_script !== 'string') {
      throw new Error(`Lua Script must be a string`);
    }

    this.Obniz.send({ plugin: { exec_lua: lua_script } });
  }

  /**
   * Executing Lua on target device and save to it's flash memory.
   *
   * ```javascript
   * // Javascript Example
   * obniz.storage.savePluginLua(`os.log("Hello World")`);
   * obniz.plugin.reloadLua();
   * ```
   *
   */
  public reloadLua() {
    if (semver.major(this.Obniz.firmware_ver!) < 7) {
      throw new Error(`Please update obniz firmware >= 7.0.0`);
    }

    this.Obniz.send({ plugin: { reload: true } });
  }

  /**
   * @ignore
   * @private
   */
  public _reset() {
    // do nothing.
  }

  /**
   * @ignore
   * @param obj
   */
  public notified(obj: any) {
    if (obj.receive) {
      /* Connectino state update. response of connect(), close from destination, response from */
      const string = ObnizUtil.dataArray2string(obj.receive);
      this.Obniz._runUserCreatedFunction(this.onreceive, obj.receive, string);
    } else if (obj.frame) {
      if (obj.frame.start) {
        const id: number = obj.frame.start.id;
        const length: number = obj.frame.start.length;
        this.Obniz._runUserCreatedFunction(this.onFrameStart, id, length);
      } else if (obj.frame.end) {
        this.Obniz._runUserCreatedFunction(this.onFrameEnd);
      }
    }
  }
}
