/**
 * @packageDocumentation
 * @module ObnizCore
 */

import EventEmitter from "eventemitter3";
import wsClient from "ws";

// @ts-ignore
import packageJson from "../../package"; // pakcage.js will be created from package.json on build.
import WSCommand from "./libs/wscommand";
import { ObnizOfflineError } from "./ObnizError";
import { ObnizOptions } from "./ObnizOptions";
import Timeout = NodeJS.Timeout;

export type ObnizConnectionEventNames = "connect" | "close" | "notify";

export default abstract class ObnizConnection extends EventEmitter<ObnizConnectionEventNames> {
  /**
   * obniz.js version
   */
  static get version() {
    return packageJson.version;
  }

  /**
   * @ignore
   * @constructor
   */
  static get WSCommand() {
    return WSCommand;
  }

  /**
   * This lets obniz.js to show logs like communicated jsons and connection logs in console.log.
   *
   * ```javascript
   * var obniz = new Obniz('1234-5678');
   * obniz.debugprint = true
   * obniz.onconnect = async function() {
   *  obniz.io0.output(true);
   * }
   * ```
   */
  public debugprint: boolean;

  /**
   * @ignore
   */
  public debugprintBinary: boolean;

  /**
   * This variable indicate connected hardware identifier of target device
   *
   * ```javascript
   * var obniz = new Obniz('1234-5678');
   * obniz.debugprint = true
   * obniz.onconnect = async function() {
   *   console.log(obniz.hw) // ex. "obnizb1"
   * }
   * ```
   */
  public hw?: string;

  /**
   * This variable indicate installed firmware version of target device
   *
   * ```javascript
   * var obniz = new Obniz('1234-5678');
   * obniz.debugprint = true
   * obniz.onconnect = async function() {
   *   console.log(obniz.firmware_ver) // ex. "2.0.0"
   * }
   * ```
   */
  public firmware_ver?: string;

  /**
   * Is node.js environment or not.
   * @readonly
   */
  public isNode: boolean;

  /**
   * obniz id
   */
  public id: string;

  /**
   * @ignore
   */
  public onopen?: (obniz: this) => void;

  /**
   * onclose will be called when disconnected.
   *
   * ```javascript
   * var obniz = new Obniz('1234-5678');
   * obniz.onconnect = async function() {
   *
   * }
   * obniz.onclose = async function() {
   *
   * }
   * ```
   */
  public onclose?: (obniz: this) => void;

  /**
   * Once connection is established, onconnect function will be called.
   *
   * ```javascript
   * var obniz = new Obniz('1234-5678');
   * obniz.onconnect = async function() {
   *
   * }
   * ```
   *
   * Operations like turning on/off an io becomes possible only after connection is established,
   * so any operations you want obniz Board to undertake must be written in onconnect
   *
   * ```javascript
   * var obniz = new Obniz('1234-5678');
   * obniz.onconnect = async function() {
   *   obniz.io0.output(true);
   * }
   * ```
   */
  public onconnect?: (obniz: this) => void;

  /**
   * This let you know connection state to your obniz Board as string value.
   *
   * - 'closed' : not connected.
   * - 'connecting' : connecting
   * - 'connected' : connection established
   * - 'closing' : closing connection.
   *
   * ```javascript
   * var obniz = new Obniz('1234-5678');
   * console.log(obniz.connectionState) // => === "connecting"
   * obniz.onconnect = async function() {
   *  console.log(obniz.connectionState) // => === "connected"
   * }
   * ```
   *
   *
   */
  public connectionState: "closed" | "connecting" | "connected" | "closing";
  protected socket: any;
  protected socket_local: any;
  protected debugs: any;
  protected bufferdAmoundWarnBytes: number;
  protected options: any;
  protected wscommand: any;
  protected wscommands: any;
  protected _sendQueueTimer: any;
  protected _sendQueue: any;
  protected _waitForLocalConnectReadyTimer: any;
  protected _connectionRetryCount: number;
  protected sendPool: any;
  private _onConnectCalled: boolean;
  private _looper: any;
  private _repeatInterval: any;
  private _nextLoopTimeout?: Timeout;
  private _nextPingTimeout?: Timeout;
  private _lastDataReceivedAt: number = 0;

  constructor(id: string, options?: ObnizOptions) {
    super();
    this.isNode = typeof window === "undefined";
    this.id = id;
    this.socket = null;
    this.socket_local = null;
    this.debugprint = false;
    this.debugprintBinary = false;
    this.debugs = [];
    this._onConnectCalled = false;
    this.hw = undefined;
    this.firmware_ver = undefined;
    this.connectionState = "closed"; // closed/connecting/connected/closing
    this.bufferdAmoundWarnBytes = 10 * 1000 * 1000; // 10M bytes

    this._connectionRetryCount = 0;

    if (!options) {
      options = {};
    }
    this.options = {
      binary: options.binary === false ? false : true,
      local_connect: options.local_connect === false ? false : true,
      debug_dom_id: options.debug_dom_id || "obniz-debug",
      auto_connect: options.auto_connect === false ? false : true,
      access_token: options.access_token || null,
      obniz_server: options.obniz_server || "wss://obniz.io",
      reset_obniz_on_ws_disconnection: options.reset_obniz_on_ws_disconnection === false ? false : true,
    };
    if (this.options.binary) {
      this.wscommand = (this.constructor as typeof ObnizConnection).WSCommand;
      const classes = (this.constructor as typeof ObnizConnection).WSCommand.CommandClasses;
      this.wscommands = [];
      for (const class_name in classes) {
        this.wscommands.push(
          new classes[class_name]({
            hw: {
              firmware: undefined,
              model: "obniz_board",
            },
            delegate: undefined,
          }),
        );
      }
    }
    if (this.options.auto_connect) {
      this.wsconnect();
    }
  }

  /**
   * With this you wait until the connection to obniz Board succeeds.
   *
   * ```javascript
   * var obniz = new Obniz('1234-5678');
   *
   * await obniz.connectWait();
   *
   * obniz.io0.output(true);
   * obniz.close();
   *
   * ```
   *
   *
   * - with timeout
   *
   * ```javascript
   * var obniz = new Obniz('1234-5678');
   *
   * await obniz.connectWait({timeout:10});  //timeout 10sec
   *
   * if(connected){
   *    obniz.io0.output(true);
   *    obniz.close();
   * }
   * ```
   *
   * - with auto_connect:false
   *
   * If the param auto_connect is set as false, it will try to connect only once and, if unsuccessful, return false.
   *
   * ```javascript
   * var obniz = new Obniz('1234-5678',{auto_connect: false});
   *
   * var connected = await obniz.connectWait();  //try once
   *
   * if(connected){
   *   obniz.io0.output(true);
   *   obniz.close();
   * }
   * ```
   *
   * @param option.timeout timeout in seconds
   * @return False will be returned when connection is not established within a set timeout.
   */
  public connectWait(option?: { timeout?: number }): Promise<boolean> {
    option = option || {};
    const timeout: any = option.timeout || null;

    return new Promise((resolve: any, reject: any) => {
      if (this._onConnectCalled) {
        resolve(true);
        return;
      }
      this.once("connect", () => {
        resolve(true);
      });

      if (timeout) {
        setTimeout(() => {
          resolve(false);
        }, timeout * 1000);
      }
      if (!this.options.auto_connect) {
        this.once("close", () => {
          resolve(false);
        });
        this.connect();
      }
    });
  }

  /**
   * You can connect to obniz Board manually by calling connect() when auto_connect is set to be false.
   *
   * ```javascript
   * var obniz = new Obniz('1234-5678', { auto_connect: false });
   *
   * obniz.connect();
   * obniz.onconnect = async function() {
   *  obniz.io0.output(true);
   * }
   * ```
   */
  public connect() {
    if (this.socket && this.socket.readyState <= 1) {
      return;
    }
    this.wsconnect();
  }

  public close() {
    this._stopLoopInBackground();
    this._drainQueued();
    // expire local connect waiting timer for call.
    if (this._waitForLocalConnectReadyTimer) {
      clearTimeout(this._waitForLocalConnectReadyTimer);
      this._waitForLocalConnectReadyTimer = undefined;
    }
    this._disconnectLocal();
    if (this.socket) {
      if (this.socket.readyState <= 1) {
        // Connecting & Connected
        this.connectionState = "closing";
        this.socket.close(1000, "close");
      }
      this.clearSocket(this.socket);
      delete this.socket;
    }
    this.connectionState = "closed";
    this._onConnectCalled = false;
  }

  /**
   * Send json/binary data to obniz Cloud or device.
   *
   * @param obj send data
   * @param options send option
   * @param options.local_connect If false, send data via gloval internet.
   */
  public send(obj: object | object[], options?: { local_connect?: boolean; connect_check?: boolean }) {
    options = options || {};
    options.local_connect = options.local_connect !== false;
    options.connect_check = options.connect_check !== false;

    if (options.connect_check && this.connectionState !== "connected") {
      throw new ObnizOfflineError();
    }
    try {
      if (!obj || typeof obj !== "object") {
        this.log("obnizjs. didnt send ", obj);
        return;
      }
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          this.send(obj[i]);
        }
        return;
      }
      if (this.sendPool) {
        this.sendPool.push(obj);
        return;
      }

      let sendData = JSON.stringify([obj]);
      if (this.debugprint) {
        this.print_debug("send: " + sendData);
      }

      /* compress */
      if (this.wscommand && options.local_connect) {
        let compressed: any;
        try {
          compressed = this.wscommand.compress(this.wscommands, JSON.parse(sendData)[0]);
          if (compressed) {
            sendData = compressed;
            if (this.debugprintBinary) {
              this.log("binalized: " + new Uint8Array(compressed).toString());
            }
          }
        } catch (e) {
          this.error({ alert: "error", message: "------ errored json -------" });
          this.error(sendData);
          throw e;
        }
      }

      /* queue sending */
      if (typeof sendData === "string") {
        this._drainQueued();
        this._sendRouted(sendData);
      } else {
        if (this._sendQueue) {
          this._sendQueue.push(sendData);
        } else {
          this._sendQueue = [sendData];
          this._sendQueueTimer = setTimeout(this._drainQueued.bind(this), 0);
        }
      }
    } catch (e) {
      this.log(e);
    }
  }

  /**
   * @ignore
   * @param msg
   */
  public warning(msg: any) {
    this.log("warning:" + msg);
  }

  /**
   * @ignore
   * @param msg
   */
  public error(msg: any) {
    console.error(`[obniz ${this.id}] error:${msg}`);
  }

  /**
   * @ignore
   */
  public log(...args: any[]) {
    console.log(`[obniz ${this.id}]`, ...args);
  }

  /**
   * @ignore
   * @private
   */
  public _runUserCreatedFunction(func?: (...args: any) => any, ...args: any[]) {
    if (!func) {
      return;
    }

    if (typeof func !== "function") {
      return;
    }

    try {
      func(...args);
    } catch (err) {
      console.error(`obniz.js handled Exception inside of ${func}`);
      setTimeout(() => {
        throw err;
      });
    }
  }

  /**
   * Repeat will call the callback function periodically while it is connected to obniz Board.
   * It will stop calling once it is disconnected from obniz Board.
   *
   * ```javascript
   * // Javascript Example
   *  obniz.ad0.start();
   *  obniz.repeat(function(){
   *    if (obniz.ad0.value > 2.5) {
   *      obniz.io0.output(true);
   *    } else {
   *      obniz.io0.output(false);
   *    }
   *  }, 100)
   * ```
   *
   * @param callback
   * @param interval  default 100. It mean 100ms interval loop.
   */
  public repeat(callback: any, interval: any) {
    if (this._looper) {
      this._looper = callback;
      this._repeatInterval = interval || this._repeatInterval || 100;
      return;
    }
    this._looper = callback;
    this._repeatInterval = interval || 100;
  }

  public abstract pingWait(unixtime?: number, rand?: number, forceGlobalNetwork?: boolean): Promise<void>;

  protected wsOnOpen() {
    this.print_debug("ws connected");
    this._connectionRetryCount = 0;
    // wait for {ws:{ready:true}} object
    if (typeof this.onopen === "function") {
      this.onopen(this);
    }
  }

  protected wsOnMessage(data: any) {
    this._lastDataReceivedAt = new Date().getTime();

    let json: any;
    if (typeof data === "string") {
      json = JSON.parse(data);
    } else if (this.wscommands) {
      if (this.debugprintBinary) {
        this.log("binalized: " + new Uint8Array(data).toString());
      }
      json = this.binary2Json(data);
    }

    if (Array.isArray(json)) {
      for (const i in json) {
        this.notifyToModule(json[i]);
      }
    } else {
      // invalid json
    }
  }

  protected wsOnClose(event: any) {
    this.print_debug(`closed from remote event=${event}`);
    const beforeOnConnectCalled = this._onConnectCalled;
    this.close();

    this.emit("close", this);
    if (beforeOnConnectCalled === true) {
      this._runUserCreatedFunction(this.onclose, this);
    }
    this._reconnect();
  }

  protected _reconnect() {
    this._connectionRetryCount++;
    let tryAfter: any = 1000;
    if (this._connectionRetryCount > 15) {
      tryAfter = (this._connectionRetryCount - 15) * 1000;
      const Limit: any = this.isNode ? 60 * 1000 : 10 * 1000;
      if (tryAfter > Limit) {
        tryAfter = Limit;
      }
    }
    if (this.options.auto_connect) {
      setTimeout(() => {
        this.wsconnect(); // always connect to mainserver if ws lost
      }, tryAfter);
    }
  }

  protected wsOnError(event: any) {
    this.print_debug(`ws onerror event=${event}`);
  }

  protected wsOnUnexpectedResponse(req: any, res?: any) {
    if (res && res.statusCode === 404) {
      this.print_debug("obniz not online");
    } else {
      this.print_debug("invalid server response " + res ? res.statusCode : "");
    }

    this.clearSocket(this.socket);
    delete this.socket;

    this._reconnect();
  }

  protected wsconnect(desired_server?: string) {
    let server = this.options.obniz_server;
    if (desired_server) {
      server = "" + desired_server;
    }

    if (this.socket && this.socket.readyState <= 1) {
      this.close();
    }

    let url = server + "/obniz/" + this.id + "/ws/1";
    if (this._isIpAddress(this.id)) {
      url = `ws://${this.id}/`;
    }

    const query: any = [];
    if ((this.constructor as typeof ObnizConnection).version) {
      query.push("obnizjs=" + (this.constructor as typeof ObnizConnection).version);
    }
    if (this.options.access_token) {
      query.push("access_token=" + this.options.access_token);
    }
    if (this.wscommand) {
      query.push("accept_binary=true");
    }
    if (query.length > 0) {
      url += "?" + query.join("&");
    }
    this.print_debug("connecting to " + url);

    let socket: any;
    if (this.isNode) {
      socket = new wsClient(url);
      socket.on("open", this.wsOnOpen.bind(this));
      socket.on("message", this.wsOnMessage.bind(this));
      socket.on("close", this.wsOnClose.bind(this));
      socket.on("error", this.wsOnError.bind(this));
      socket.on("unexpected-response", this.wsOnUnexpectedResponse.bind(this));
    } else {
      socket = new WebSocket(url);
      socket.binaryType = "arraybuffer";
      socket.onopen = this.wsOnOpen.bind(this);
      socket.onmessage = (event: any) => {
        this.wsOnMessage(event.data);
      };
      socket.onclose = this.wsOnClose.bind(this);
      socket.onerror = this.wsOnError.bind(this);
    }
    this.socket = socket;

    this.connectionState = "connecting";
  }

  protected _connectLocal(host: any) {
    const url = "ws://" + host;
    this.print_debug("local connect to " + url);
    let ws: any;
    if (this.isNode) {
      ws = new wsClient(url);
      ws.on("open", () => {
        this.print_debug("connected to " + url);
        this._callOnConnect();
      });
      ws.on("message", (data: any) => {
        this.print_debug("recvd via local");
        this.wsOnMessage(data);
      });
      ws.on("close", (event: any) => {
        this.log("local websocket closed");
        this._disconnectLocal();
      });
      ws.on("error", (err: any) => {
        console.error("local websocket error.", err);
        this._disconnectLocal();
      });
      ws.on("unexpected-response", (event: any) => {
        this.log("local websocket closed");
        this._disconnectLocal();
      });
    } else {
      ws = new WebSocket(url);
      ws.binaryType = "arraybuffer";
      ws.onopen = () => {
        this.print_debug("connected to " + url);
        this._callOnConnect();
      };
      ws.onmessage = (event: any) => {
        this.print_debug("recvd via local");
        this.wsOnMessage(event.data);
      };
      ws.onclose = (event: any) => {
        this.log("local websocket closed");
        this._disconnectLocal();
      };
      ws.onerror = (err: any) => {
        this.log("local websocket error.", err);
        this._disconnectLocal();
      };
    }
    this.socket_local = ws;
  }

  protected _disconnectLocal() {
    if (this.socket_local) {
      if (this.socket_local.readyState <= 1) {
        this.socket_local.close();
      }
      this.clearSocket(this.socket_local);
      delete this.socket_local;
    }
    // If connection to cloud is ready and waiting for local connect.
    // then call onconnect() immidiately.
    if (this.socket && this.socket.readyState === 1 && this._waitForLocalConnectReadyTimer) {
      clearTimeout(this._waitForLocalConnectReadyTimer);
      this._waitForLocalConnectReadyTimer = null;
      this._callOnConnect();
    }
  }

  protected clearSocket(socket: any) {
    if (!socket) {
      return;
    }
    /* send queue */
    if (this._sendQueueTimer) {
      delete this._sendQueue;
      clearTimeout(this._sendQueueTimer);
      this._sendQueueTimer = null;
    }
    /* unbind */
    if (this.isNode) {
      const shouldRemoveObservers = ["open", "message", "close", "error", "unexpected-response"];
      for (let i = 0; i < shouldRemoveObservers.length; i++) {
        socket.removeAllListeners(shouldRemoveObservers[i]);
      }
    } else {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onclose = null;
      socket.onerror = null;
    }
  }

  /**
   * This function will be called before obniz.onconnect called;
   */
  protected async _beforeOnConnect() {}

  protected _callOnConnect() {
    let canChangeToConnected = true;
    if (this._waitForLocalConnectReadyTimer) {
      /* obniz.js can't wait for local_connect any more! */
      clearTimeout(this._waitForLocalConnectReadyTimer);
      this._waitForLocalConnectReadyTimer = null;
    } else {
      /* obniz.js has to wait for local_connect establish */
      if (this.socket_local && this.socket_local.readyState === 1) {
        /* delayed connect */
        canChangeToConnected = false;
      } else {
        /* local_connect is not used */
      }
    }

    if (canChangeToConnected) {
      const currentTime = new Date().getTime();
      this._lastDataReceivedAt = currentTime; // reset

      this.connectionState = "connected";
      this._beforeOnConnect();
      this.emit("connect", this);
      if (typeof this.onconnect === "function") {
        try {
          const promise: any = this.onconnect(this);
          if (promise instanceof Promise) {
            promise.catch((err) => {
              setTimeout(() => {
                throw err;
              });
            });
          }
        } catch (err) {
          console.error(`obniz.js handled Exception inside of onconnect()`);
          setTimeout(() => {
            throw err;
          });
        }
      }
      this._onConnectCalled = true;
      this._startPingLoopInBackground();
      this._startLoopInBackground();
    }
  }

  protected _isIpAddress(str: string) {
    const regex = /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/;
    return str.match(regex) !== null;
  }

  protected print_debug(str: any) {
    if (this.debugprint) {
      this.log(str);
    }
  }

  protected _sendRouted(data: any) {
    if (this.socket_local && this.socket_local.readyState === 1 && typeof data !== "string") {
      this.print_debug("send via local");
      this.socket_local.send(data);
      if (this.socket_local.bufferedAmount > this.bufferdAmoundWarnBytes) {
        this.warning("over " + this.socket_local.bufferedAmount + " bytes queued");
      }
      return;
    }

    if (this.socket && this.socket.readyState === 1) {
      this.socket.send(data);
      if (this.socket.bufferedAmount > this.bufferdAmoundWarnBytes) {
        this.warning("over " + this.socket.bufferedAmount + " bytes queued");
      }
      return;
    }
  }

  protected _drainQueued() {
    if (!this._sendQueue) {
      return;
    }
    let expectSize = 0;
    for (let i = 0; i < this._sendQueue.length; i++) {
      expectSize += this._sendQueue[i].length;
    }
    let filled = 0;
    const sendData = new Uint8Array(expectSize);
    for (let i = 0; i < this._sendQueue.length; i++) {
      sendData.set(this._sendQueue[i], filled);
      filled += this._sendQueue[i].length;
    }
    this._sendRouted(sendData);
    delete this._sendQueue;
    clearTimeout(this._sendQueueTimer);
    this._sendQueueTimer = null;
  }

  protected notifyToModule(obj: any) {
    if (this.debugprint) {
      this.print_debug(JSON.stringify(obj));
    }

    if (obj.ws) {
      this.handleWSCommand(obj.ws);
      return;
    }
    if (obj.system) {
      this.handleSystemCommand(obj.system);
      return;
    }
  }

  protected _canConnectToInsecure() {
    if (this.isNode) {
      return true;
    } else {
      return location.protocol !== "https:";
    }
  }

  protected handleWSCommand(wsObj: any) {
    if (wsObj.ready) {
      this.firmware_ver = wsObj.obniz.firmware;
      this.hw = wsObj.obniz.hw;
      if (!this.hw) {
        this.hw = "obnizb1";
      }
      if (this.wscommands) {
        for (let i = 0; i < this.wscommands.length; i++) {
          const command: any = this.wscommands[i];
          command.setHw({
            hw: this.hw, // hard coding
            firmware: this.firmware_ver,
          });
        }
      }
      if (this.options.reset_obniz_on_ws_disconnection) {
        (this as any).resetOnDisconnect(true);
      }
      if (
        wsObj.local_connect &&
        wsObj.local_connect.ip &&
        this.wscommand &&
        this.options.local_connect &&
        this._canConnectToInsecure()
      ) {
        this._connectLocal(wsObj.local_connect.ip);
        this._waitForLocalConnectReadyTimer = setTimeout(() => {
          this._callOnConnect();
        }, 3000);
      } else {
        this._callOnConnect();
      }
    }
    if (wsObj.redirect) {
      const server: any = wsObj.redirect;
      this.print_debug("WS connection changed to " + server);

      /* close current ws immidiately */
      /*  */
      this.socket.close(1000, "close");
      this.clearSocket(this.socket);
      delete this.socket;

      /* connect to new server */
      this.wsconnect(server);
    }
  }

  protected handleSystemCommand(wsObj: any) {}

  protected binary2Json(binary: any) {
    let data: any = new Uint8Array(binary);
    const json: any = [];
    while (data !== null) {
      const frame: any = WSCommand.dequeueOne(data);
      if (!frame) {
        break;
      }
      const obj: any = {};
      for (let i = 0; i < this.wscommands.length; i++) {
        const command: any = this.wscommands[i];
        if (command.module === frame.module) {
          command.notifyFromBinary(obj, frame.func, frame.payload);
          break;
        }
      }
      json.push(obj);
      data = frame.next;
    }
    return json;
  }

  private _startLoopInBackground() {
    this._stopLoopInBackground();
    this._nextLoopTimeout = setTimeout(async () => {
      if (this._nextLoopTimeout) {
        clearTimeout(this._nextLoopTimeout);
      }
      this._nextLoopTimeout = undefined;
      if (this.connectionState === "connected") {
        try {
          if (typeof this._looper === "function") {
            await this.pingWait();
            const prom: any = this._looper();
            if (prom instanceof Promise) {
              await prom;
            }
          }
        } catch (e) {
          console.error(`obniz.js handled Exception inside of obniz.repeat() function`);
          console.error(e);
        } finally {
          if (this.connectionState === "connected") {
            if (!this._nextLoopTimeout) {
              this._nextLoopTimeout = setTimeout(this._startLoopInBackground.bind(this), this._repeatInterval || 100);
            }
          }
        }
      }
    }, 0);
  }

  private _stopLoopInBackground() {
    if (this._nextLoopTimeout) {
      clearTimeout(this._nextLoopTimeout);
      this._nextLoopTimeout = undefined;
    }
  }

  private _startPingLoopInBackground() {
    if (this._nextPingTimeout) {
      clearTimeout(this._nextPingTimeout);
    }
    this._nextPingTimeout = setTimeout(async () => {
      const loopInterval = 60 * 1000; // 60 sec
      const loopTimeout = 30 * 1000; // 30 sec
      if (this._nextPingTimeout) {
        clearTimeout(this._nextPingTimeout);
      }
      this._nextPingTimeout = undefined;
      if (this.connectionState === "connected") {
        const currentTime = new Date().getTime();

        // after 15 sec from last data received
        if (this._lastDataReceivedAt + loopTimeout < currentTime) {
          const time = this._lastDataReceivedAt;
          try {
            const p = this.pingWait();
            const wait = new Promise((resolve, reject) => {
              setTimeout(reject, loopTimeout);
            });
            await Promise.race([p, wait]);
            // this.log("ping/pong success");
          } catch (e) {
            if (this.connectionState !== "connected") {
              // already closed
            } else if (time !== this._lastDataReceivedAt) {
              // this will be disconnect -> reconnect while pingWait
            } else {
              // ping error or timeout
              // this.error("ping/pong response timeout error");
              this.wsOnClose("ping/pong response timeout error");
              return;
            }
          }
        } else {
          // this.log("ping/pong not need");
        }

        if (this.connectionState === "connected") {
          if (!this._nextPingTimeout) {
            this._nextPingTimeout = setTimeout(this._startPingLoopInBackground.bind(this), loopInterval);
          }
        }
      }
    }, 0);
  }
}
