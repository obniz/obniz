/**
 * @packageDocumentation
 * @module ObnizCore
 */

import emitter = require("eventemitter3");
import wsClient = require("ws");

// @ts-ignore
import packageJson from "../../package";  // pakcage.js will be created from package.json on build.
import WSCommand from "./libs/wscommand";

const isNode: any = typeof window === "undefined";

export default class ObnizConnection {

  static get version() {

    return packageJson.version;
  }

  static get WSCommand() {
    return WSCommand;
  }

  public debugprint: boolean;
  public debugprintBinary: boolean;
  public hw: any;
  public firmware_ver: any;

  /**
   * @ignore
   */
  public isNode: boolean;
  public id: any;
  protected socket: any;
  protected socket_local: any;
  protected debugs: any;
  protected onConnectCalled: boolean;
  protected connectionState: "closed" | "connecting" | "connected" | "closing";
  protected bufferdAmoundWarnBytes: number;
  protected emitter: any;
  protected options: any;
  protected wscommand: any;
  protected wscommands: any;
  protected _sendQueueTimer: any;
  protected _sendQueue: any;
  protected _waitForLocalConnectReadyTimer: any;
  protected _connectionRetryCount: number;
  protected onopen: any;
  protected onclose: any;
  protected onconnect: any;
  protected sendPool: any;

  constructor(id: any, options?: any) {
    this.isNode = isNode;
    this.id = id;
    this.socket = null;
    this.socket_local = null;
    this.debugprint = false;
    this.debugprintBinary = false;
    this.debugs = [];
    this.onConnectCalled = false;
    this.hw = undefined;
    this.firmware_ver = undefined;
    this.connectionState = "closed"; // closed/connecting/connected/closing
    this.bufferdAmoundWarnBytes = 10 * 1000 * 1000; // 10M bytes
    this.emitter = new emitter();

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
      reset_obniz_on_ws_disconnection:
        options.reset_obniz_on_ws_disconnection === false ? false : true,
    };
    if (this.options.binary) {
      this.wscommand = (this.constructor as typeof ObnizConnection).WSCommand;
      const classes: any = (this.constructor as typeof ObnizConnection).WSCommand.CommandClasses;
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

  public prompt(filled: any, callback: any) {
    const obnizid: any = prompt("Please enter obniz id", filled);
    if (obnizid) {
      callback(obnizid);
    }
  }

  public wsOnOpen() {
    this.print_debug("ws connected");
    this._connectionRetryCount = 0;
    // wait for {ws:{ready:true}} object
    if (typeof this.onopen === "function") {
      this.onopen(this);
    }
  }

  public wsOnMessage(data: any) {
    let json: any;
    if (typeof data === "string") {
      json = JSON.parse(data);
    } else if (this.wscommands) {
      if (this.debugprintBinary) {
        console.log("Obniz: binalized: " + new Uint8Array(data).toString());
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

  public connectWait(option: any) {
    option = option || {};
    const timeout: any = option.timeout || null;

    return new Promise((resolve: any, reject: any) => {
      if (this.onConnectCalled) {
        resolve(true);
        return;
      }
      this.emitter.once("connected", () => {
        resolve(true);
      });
      if (!this.options.auto_connect) {
        this.emitter.once("closed", () => {
          resolve(false);
        });
      }
      if (timeout) {
        setTimeout(() => {
          resolve(false);
        }, timeout * 1000);
      }
      this.connect();
    });
  }

  public connect() {
    if (this.socket && this.socket.readyState <= 1) {
      return;
    }
    this.wsconnect();
  }

  public close() {
    this._drainQueued();
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
  }

  public send(obj: any, options?: any) {
    try {
      if (!obj || typeof obj !== "object") {
        console.log("obnizjs. didnt send ", obj);
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

      let sendData: any = JSON.stringify([obj]);
      if (this.debugprint) {
        this.print_debug("send: " + sendData);
      }

      /* compress */
      if (
        this.wscommand &&
        (typeof options !== "object" || options.local_connect !== false)
      ) {
        let compressed: any;
        try {
          compressed = this.wscommand.compress(
            this.wscommands,
            JSON.parse(sendData)[0],
          );
          if (compressed) {
            sendData = compressed;
            if (this.debugprintBinary) {
              console.log(
                "Obniz: binalized: " + new Uint8Array(compressed).toString(),
              );
            }
          }
        } catch (e) {
          this.error("------ errored json -------");
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
      console.log(e);
    }
  }

  public warning(msg: any) {
    console.log("warning:" + msg);
  }

  public error(msg: any) {
    console.error("error:" + msg);
  }

  protected wsOnClose(event: any) {
    this.print_debug("closed");
    this.close();
    this.emitter.emit("closed");
    if (typeof this.onclose === "function" && this.onConnectCalled === true) {
      this.onclose(this);
    }
    this.onConnectCalled = false;

    this._reconnect();
  }

  protected _reconnect() {
    this._connectionRetryCount++;
    let tryAfter: any = 1000;
    if (this._connectionRetryCount > 15) {
      tryAfter = (this._connectionRetryCount - 15) * 1000;
      const Limit: any = isNode ? 60 * 1000 : 10 * 1000;
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
    // console.error(event);
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

  protected wsconnect(desired_server?: any) {
    let server: any = this.options.obniz_server;
    if (desired_server) {
      server = "" + desired_server;
    }

    if (this.socket && this.socket.readyState <= 1) {
      this.close();
    }

    let url: any = server + "/obniz/" + this.id + "/ws/1";

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
    const url: any = "ws://" + host;
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
        console.log("local websocket closed");
        this._disconnectLocal();
      });
      ws.on("error", (err: any) => {
        console.error("local websocket error.", err);
        this._disconnectLocal();
      });
      ws.on("unexpected-response", (event: any) => {
        console.log("local websocket closed");
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
        console.log("local websocket closed");
        this._disconnectLocal();
      };
      ws.onerror = (err: any) => {
        console.log("local websocket error.", err);
        this._disconnectLocal();
      };
    }
    this.socket_local = ws;
  }

  protected _disconnectLocal() {
    if (this.socket_local) {
      if (this.socket.readyState <= 1) {
        this.socket_local.close();
      }
      this.clearSocket(this.socket_local);
      delete this.socket_local;
    }
    if (this._waitForLocalConnectReadyTimer) {
      clearTimeout(this._waitForLocalConnectReadyTimer);
      this._waitForLocalConnectReadyTimer = null;
      this._callOnConnect(); /* should call. onlyl local connect was lost. and waiting. */
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
      const shouldRemoveObservers: any = [
        "open",
        "message",
        "close",
        "error",
        "unexpected-response",
      ];
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

  protected _callOnConnect() {
    let canChangeToConnected: any = true;
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

    this.emitter.emit("connected");

    if (canChangeToConnected) {
      this.connectionState = "connected";
      if (typeof this.onconnect === "function") {
        const promise: any = this.onconnect(this);
        if (promise instanceof Promise) {
          promise.catch((err: any) => {
            console.error(err);
          });
        }
      }
      this.onConnectCalled = true;
    }
  }

  protected print_debug(str: any) {
    if (this.debugprint) {
      console.log("Obniz: " + str);
    }
  }

  protected _sendRouted(data: any) {
    if (
      this.socket_local &&
      this.socket_local.readyState === 1 &&
      typeof data !== "string"
    ) {
      this.print_debug("send via local");
      this.socket_local.send(data);
      if (this.socket_local.bufferedAmount > this.bufferdAmoundWarnBytes) {
        this.warning(
          "over " + this.socket_local.bufferedAmount + " bytes queued",
        );
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
    let expectSize: any = 0;
    for (let i = 0; i < this._sendQueue.length; i++) {
      expectSize += this._sendQueue[i].length;
    }
    let filled: any = 0;
    const sendData: any = new Uint8Array(expectSize);
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

  protected handleSystemCommand(wsObj: any) {
  }

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
}
