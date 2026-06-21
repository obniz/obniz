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

interface LuaError {
  message: string;
}

/**
 * Handler called when Lua runs `cloud.transactionWait(data)` on the device.
 *
 * It receives the data sent from Lua and must return the result that will be
 * passed back to the waiting Lua coroutine. Returning normally is reported to
 * Lua as `success = true`; throwing (or rejecting) is reported as
 * `success = false` with the error message as the result.
 *
 * @param data raw bytes sent from Lua
 * @param str the same data decoded as a string
 */
type PluginCloudTransactionHandler = (
  data: number[],
  str: string
) =>
  | string
  | number[]
  | Buffer
  | void
  | Promise<string | number[] | Buffer | void>;

interface PendingCall {
  resolve: (result: string) => void;
  reject: (err: Error) => void;
  timer: ReturnType<typeof setTimeout> | null;
}

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

  /**
   * Callback function is called when Frame Information Received
   *
   * ```javascript
   * // Javascript Example
   * obniz.plugin.onError = error => {
   *   console.log(`error occurred: ${error.message}`);
   * };
   * ```
   *
   */
  public onError?: (error: LuaError) => void;

  /**
   * Handler called when Lua runs `cloud.transactionWait(data)` on the device.
   *
   * ```javascript
   * // Javascript Example
   * obniz.plugin.onCloudTransaction = async (data, str) => {
   *   // do something with the request from Lua and return the result
   *   return "result for lua";
   * };
   * ```
   *
   */
  public onCloudTransaction?: PluginCloudTransactionHandler;

  private Obniz: Obniz;

  private _callTransactionId = 0;
  private _pendingCalls: { [id: number]: PendingCall } = {};

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
   * Executing Lua on target device and wait for its returned value.
   *
   * The Lua script is run inside a coroutine on the device. Whatever the script
   * `return`s (as a string) is resolved here. If the script raises an error, the
   * returned Promise is rejected with that error message.
   *
   * The Lua side may itself call `cloud.transactionWait(...)` while running,
   * which is delivered to {@link Plugin.onCloudTransaction}.
   *
   * ```javascript
   * // Javascript Example
   * const result = await obniz.plugin.callWait(`return "hello from lua"`);
   * console.log(result); // "hello from lua"
   * ```
   *
   * @param lua_script Lua script to be run on target device
   * @param timeout timeout in milliseconds (default 30000)
   */
  public callWait(lua_script: string, timeout = 30 * 1000): Promise<string> {
    // Require firmware 7.1 or later. Compare by major/minor so prereleases
    // (e.g. 7.1.0-beta.0) are also accepted.
    const major = semver.major(this.Obniz.firmware_ver!);
    const minor = semver.minor(this.Obniz.firmware_ver!);
    if (major < 7 || (major === 7 && minor < 1)) {
      throw new Error(`Please update obniz firmware >= 7.1.0`);
    }

    if (typeof lua_script !== 'string') {
      throw new Error(`Lua Script must be a string`);
    }

    const id = this._getNextTransactionId();

    return new Promise<string>((resolve, reject) => {
      let timer: ReturnType<typeof setTimeout> | null = null;
      if (timeout > 0) {
        timer = setTimeout(() => {
          delete this._pendingCalls[id];
          reject(new Error(`obniz.plugin.callWait() timed out`));
        }, timeout);
      }
      this._pendingCalls[id] = { resolve, reject, timer };

      this.Obniz.send({ plugin: { call_request: { id, lua: lua_script } } });
    });
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
    // Reject all in-flight callWait() promises since the connection was reset.
    for (const id of Object.keys(this._pendingCalls)) {
      const pending = this._pendingCalls[id as any];
      if (pending.timer) {
        clearTimeout(pending.timer);
      }
      pending.reject(new Error(`obniz.plugin.callWait() aborted by reset`));
    }
    this._pendingCalls = {};
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
    } else if (obj.error) {
      this.Obniz._runUserCreatedFunction(this.onError, obj.error);
    } else if (obj.call_response) {
      this._onCallResponse(obj.call_response);
    } else if (obj.cloud_transaction_request) {
      this._handleCloudTransactionWait(obj.cloud_transaction_request);
    }
  }

  private _getNextTransactionId(): number {
    this._callTransactionId = (this._callTransactionId + 1) >>> 0;
    if (this._callTransactionId === 0) {
      this._callTransactionId = 1;
    }
    return this._callTransactionId;
  }

  private _onCallResponse(res: { id: number; status: number; result: string }) {
    const pending = this._pendingCalls[res.id];
    if (!pending) {
      return;
    }
    delete this._pendingCalls[res.id];
    if (pending.timer) {
      clearTimeout(pending.timer);
    }
    if (res.status === 0) {
      pending.resolve(res.result);
    } else {
      pending.reject(new Error(res.result || `Lua error`));
    }
  }

  private async _handleCloudTransactionWait(req: {
    id: number;
    data: number[];
  }) {
    const string = ObnizUtil.dataArray2string(req.data) || '';

    if (typeof this.onCloudTransaction !== 'function') {
      // No handler registered. Report failure so Lua does not hang until timeout.
      this.Obniz.send({
        plugin: {
          cloud_transaction_response: {
            id: req.id,
            success: false,
            result: `no onCloudTransaction handler`,
          },
        },
      });
      return;
    }

    let success = true;
    let result = '';
    try {
      const ret = await this.onCloudTransaction(req.data, string);
      result = this._transactionResultToString(ret);
    } catch (e) {
      success = false;
      result = e instanceof Error ? e.message : `${e}`;
    }

    this.Obniz.send({
      plugin: {
        cloud_transaction_response: {
          id: req.id,
          success,
          result,
        },
      },
    });
  }

  private _transactionResultToString(
    ret: string | number[] | Buffer | void
  ): string {
    if (ret === undefined || ret === null) {
      return '';
    }
    if (typeof ret === 'string') {
      return ret;
    }
    if (this.Obniz.isNode && ret instanceof Buffer) {
      return ret.toString('utf8');
    }
    if (Array.isArray(ret)) {
      return Buffer.from(ret).toString('utf8');
    }
    return `${ret}`;
  }
}
