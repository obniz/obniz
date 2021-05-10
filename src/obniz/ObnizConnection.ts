/**
 * @packageDocumentation
 * @module ObnizCore
 */

import EventEmitter from 'eventemitter3';
import wsClient from 'ws';

// @ts-ignore
import packageJson from '../../package'; // pakcage.js will be created from package.json on build.
import WSCommand from './libs/wscommand';
import { ObnizOfflineError } from './ObnizError';
import { ObnizOptions } from './ObnizOptions';

export type ObnizConnectionEventNames = 'connect' | 'close';

export interface ObnizErrorMessage {
  alert: 'warn' | 'error';
  message: string;
}

/**
 * @ignore
 *
 */
type ObnizConnectionEventNamesInternal =
  | '_close'
  | '_cloudConnectRedirect'
  | '_cloudConnectReady'
  | '_cloudConnectClose'
  | '_localConnectReady'
  | '_localConnectClose';

export default abstract class ObnizConnection extends EventEmitter<
  ObnizConnectionEventNames | ObnizConnectionEventNamesInternal
> {
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

  public static isIpAddress(str: string) {
    const regex = /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/;
    return regex.exec(str) !== null;
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
   * Device metadata set on obniz cloud.
   *
   * ```javascript
   * var obniz = new Obniz('1234-5678');
   * obniz.debugprint = true
   * obniz.onconnect = async function() {
   *   console.log(obniz.metadata.description) // value for "description"
   * }
   * ```
   */
  public metadata?: { [key: string]: string };

  /**
   * Is node.js environment or not.
   *
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
   * Called continuously while obniz device is online.
   * Put your main code inside of onloop and put your setup code inside of onconnect.
   *
   * onloop will be called after onconnect called. If your funciton set to onconnect return promise, onloop wait until done promise. Even onconnect throws an error onloop will start.
   *
   * onloop call `pingWait()` every time to keep connection data buffer between device to your software clean.
   *
   * ```javascript
   * var obniz = new Obniz('1234-5678');
   * obniz.onconnect = async function() {
   *
   * }
   * obniz.onloop = async function() {
   *
   * }
   * ```
   *
   */
  public onloop?: (obniz: this) => void;

  /**
   * If an error occurs, the onerror function is called.
   *
   * ```javascript
   * var obniz = new Obniz('1234-5678');
   * obniz.onconnect = async function() {
   *
   * }
   * obniz.onerror = async function(ob, error) {
   *    console.error(error);
   * }
   * ```
   */
  public onerror?: (obniz: this, error: Error) => void;

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
  public connectionState: 'closed' | 'connecting' | 'connected' | 'closing';
  protected socket: wsClient | null = null;
  protected socket_local: wsClient | null = null;
  protected bufferdAmoundWarnBytes: number;
  protected options: Required<ObnizOptions>;
  protected wscommand: typeof WSCommand | null = null;
  protected wscommands: WSCommand[] = [];
  protected _sendQueueTimer: ReturnType<typeof setTimeout> | null = null;
  protected _sendQueue: Uint8Array[] | null = null;
  protected _waitForLocalConnectReadyTimer: ReturnType<
    typeof setTimeout
  > | null = null;
  protected _connectionRetryCount: number;
  private _sendPool: any[] | null = null;
  private _onConnectCalled: boolean;
  private _repeatInterval = 0;
  private _nextLoopTimeout: ReturnType<typeof setTimeout> | null = null;
  private _nextPingTimeout: ReturnType<typeof setTimeout> | null = null;
  private _nextAutoConnectLoopTimeout: ReturnType<
    typeof setTimeout
  > | null = null;
  private _lastDataReceivedAt = 0;
  private _autoConnectTimeout?: ReturnType<typeof setTimeout>;
  private _localConnectIp: string | null = null;

  constructor(id: string, options?: ObnizOptions) {
    super();
    this.isNode = typeof window === 'undefined';
    this.id = id;
    this.socket = null;
    this.socket_local = null;
    this.debugprint = false;
    this.debugprintBinary = false;
    this._onConnectCalled = false;
    this.hw = undefined;
    this.firmware_ver = undefined;
    this.connectionState = 'closed'; // closed/connecting/connected/closing
    this.bufferdAmoundWarnBytes = 10 * 1000 * 1000; // 10M bytes

    this._connectionRetryCount = 0;

    if (!options) {
      options = {};
    }
    this.options = {
      binary: options.binary === false ? false : true,
      local_connect: options.local_connect === false ? false : true,
      debug_dom_id: options.debug_dom_id || 'obniz-debug',
      auto_connect: options.auto_connect === false ? false : true,
      access_token: options.access_token || null,
      obniz_server: options.obniz_server || 'wss://obniz.io',
      reset_obniz_on_ws_disconnection:
        options.reset_obniz_on_ws_disconnection === false ? false : true,
      obnizid_dialog: options.obnizid_dialog === false ? false : true,
    };
    if (this.options.binary) {
      this.wscommand = (this.constructor as typeof ObnizConnection).WSCommand;
      const classes = this.wscommand.CommandClasses;
      this.wscommands = [];
      for (const class_name in classes) {
        this.wscommands.push(new classes[class_name]());
      }
    }
    if (this.autoConnect) {
      this._startAutoConnectLoopInBackground();
    }
  }

  public get autoConnect() {
    return this.options.auto_connect;
  }

  public set autoConnect(val: boolean) {
    const before = this.options.auto_connect;
    this.options.auto_connect = !!val;
    if (before !== this.options.auto_connect) {
      if (this.options.auto_connect) {
        this._startAutoConnectLoopInBackground();
      } else {
        this._stopAutoConnectLoopInBackground();
      }
    }
  }

  public startCommandPool() {
    this._sendPool = [];
  }

  public endCommandPool() {
    const pool = this._sendPool;
    this._sendPool = null;
    return pool;
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
   * await obniz.closeWait();
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
   *    await obniz.closeWait();
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
   *   await obniz.closeWait();
   * }
   * ```
   *
   * @param option.timeout timeout in seconds
   * @return False will be returned when connection is not established within a set timeout.
   */
  public async connectWait(option?: { timeout?: number }): Promise<boolean> {
    option = option || {};
    const timeout: any = option.timeout || null;

    if (this.connectionState === 'connected') {
      return true;
    }

    if (!this.autoConnect) {
      try {
        await this.tryWsConnectOnceWait();
        return true;
      } catch (e) {
        return false;
      }
    }
    return new Promise((resolve: any, reject: any) => {
      if (this._onConnectCalled) {
        resolve(true);
        return;
      }
      this.once('connect', () => {
        resolve(true);
      });

      if (timeout) {
        setTimeout(() => {
          resolve(false);
        }, timeout * 1000);
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
    if (
      this.connectionState === 'connected' ||
      this.connectionState === 'connecting'
    ) {
      return;
    }
    this.tryWsConnectOnceWait().catch((e) => {
      this.error(e);
    });
  }

  /**
   * This closes the current connection.
   * You need to set auto_connect to false. Otherwise the connection will be recovered.
   *
   * ```javascript
   * var obniz = new Obniz('1234-5678', {
   *   auto_connect: false,
   *   reset_obniz_on_ws_disconnection: false
   * });
   *
   * obniz.connect();
   * obniz.onconnect = async function() {
   *   obniz.io0.output(true);
   *   obniz.close();
   * }
   * ```
   *
   * @deprecated replace with {@link closeWait}
   */
  public close() {
    // noinspection JSIgnoredPromiseFromCall
    this.closeWait().catch((e) => {
      // background
      this.error(e);
    });
  }

  /**
   * This closes the current connection.
   * You need to set auto_connect to false. Otherwise the connection will be recovered.
   *
   * ```javascript
   * var obniz = new Obniz('1234-5678', {
   *   auto_connect: false,
   *   reset_obniz_on_ws_disconnection: false
   * });
   *
   * obniz.connect();
   * obniz.onconnect = async function() {
   *   obniz.io0.output(true);
   *   await obniz.closeWait();
   * }
   * ```
   *
   */
  public async closeWait() {
    this.autoConnect = false;
    if (
      this.connectionState === 'connecting' ||
      this.connectionState === 'connected' ||
      this.connectionState === 'closing'
    ) {
      this.connectionState = 'closing';
      const p = new Promise((resolve) => {
        this.once('_close', resolve);
      });
      this._disconnectCloudRequest();
      await p;
    }
  }

  /**
   * Send json/binary data to obniz Cloud or device.
   *
   * @param obj send data
   * @param options send option
   * @param options.local_connect If false, send data via gloval internet.
   */
  public send(
    obj: Record<string, any> | Record<string, any>[],
    options?: { local_connect?: boolean; connect_check?: boolean }
  ) {
    options = options || {};
    options.local_connect = options.local_connect !== false;
    options.connect_check = options.connect_check !== false;

    if (options.connect_check && this.connectionState !== 'connected') {
      throw new ObnizOfflineError();
    }
    try {
      if (!obj || typeof obj !== 'object') {
        this.log('obnizjs. didnt send ', obj);
        return;
      }
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          this.send(obj[i]);
        }
        return;
      }
      if (this._sendPool) {
        this._sendPool.push(obj);
        return;
      }

      let sendData = JSON.stringify([obj]);
      if (this.debugprint) {
        this._print_debug('send: ' + sendData);
      }

      /* compress */
      if (this.wscommand && options.local_connect) {
        let compressed: any;
        try {
          compressed = this.wscommand.compress(
            this.wscommands,
            JSON.parse(sendData)[0]
          );
          if (compressed) {
            sendData = compressed;
            if (this.debugprintBinary) {
              this.log('binalized: ' + new Uint8Array(compressed).toString());
            }
          }
        } catch (e) {
          this.error({
            alert: 'error',
            message: '------ errored json -------',
          });
          this.error({
            alert: 'error',
            message: sendData,
          });
          throw e;
        }
      }

      /* queue sending */
      if (typeof sendData === 'string') {
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
    this.log('warning:' + msg);
  }

  /**
   * @ignore
   * @param msg
   */
  public error(msg: ObnizErrorMessage | Error) {
    console.error(`[obniz ${this.id}] error:${msg.message}`);
  }

  /**
   * @ignore
   */
  public log(...args: any[]) {
    console.log(new Date(), `[obniz ${this.id}]`, ...args);
  }

  /**
   * @ignore
   * @private
   */
  public _runUserCreatedFunction(
    func?: (..._args: any) => any,
    ...args: any[]
  ) {
    if (!func) {
      return;
    }

    if (typeof func !== 'function') {
      return;
    }

    let promise;
    try {
      promise = func(...args);
      if (promise instanceof Promise) {
        promise.catch((err) => {
          setTimeout(() => {
            throw err;
          });
        });
      }
    } catch (err) {
      console.error(`obniz.js handled Exception inside of ${func}`);
      setTimeout(() => {
        throw err;
      });
    }
    return promise;
  }

  /**
   * Set onloop function. Use onloop property instead. This is deprecated function.
   *
   * @param callback
   * @param interval  default 100. It mean 100ms interval loop.
   * @deprecated
   */
  public repeat(callback: any, interval?: any) {
    if (this.onloop) {
      this.onloop = callback;
      this._repeatInterval = interval || this._repeatInterval || 100;
      return;
    }
    this.onloop = callback;
    this._repeatInterval = interval || 100;
  }

  public abstract pingWait(
    unixtime?: number,
    rand?: number,
    forceGlobalNetwork?: boolean
  ): Promise<void>;

  protected _close() {
    this._stopLoopInBackground();
    this._drainQueued();
    this._disconnectLocal();
    this._disconnectCloud();
    this._onConnectCalled = false;
  }

  protected wsOnOpen() {
    this._print_debug('ws connected');
    this._connectionRetryCount = 0;
    // wait for {ws:{ready:true}} object
    if (typeof this.onopen === 'function') {
      this.onopen(this);
    }
  }

  protected wsOnMessage(data: any) {
    this._lastDataReceivedAt = new Date().getTime();

    try {
      let json: any;
      if (typeof data === 'string') {
        json = JSON.parse(data);
      } else if (this.wscommands) {
        if (this.debugprintBinary) {
          this.log('binalized: ' + new Uint8Array(data).toString());
        }
        json = this._binary2Json(data);
      }

      if (Array.isArray(json)) {
        for (const i in json) {
          this._notifyToModule(json[i]);
        }
      } else {
        // invalid json
      }
    } catch (e) {
      console.error(e);
      this.error(e);
    }
  }

  protected wsOnClose(event: any) {
    this._print_debug(`closed from remote event=${event}`);
    const beforeOnConnectCalled = this._onConnectCalled;
    this._close();
    this.connectionState = 'closed';

    this.emit('_close', this);

    if (beforeOnConnectCalled === true) {
      this.emit('close', this);
      this._runUserCreatedFunction(this.onclose, this);
    }

    if (this.autoConnect) {
      this._startAutoConnectLoopInBackground();
    }
  }

  protected wsOnError(event: any) {
    this._print_debug(`ws onerror event=${event}`);
  }

  protected wsOnUnexpectedResponse(req: any, res?: any) {
    if (res && res.statusCode === 404) {
      this._print_debug('obniz not online');
    } else {
      this._print_debug('invalid server response ' + res ? res.statusCode : '');
    }

    this._disconnectCloudRequest();
  }

  protected async tryWsConnectOnceWait(desired_server?: string) {
    try {
      this.connectionState = 'connecting';
      await this._connectCloudWait(desired_server);
      try {
        const localConnectTimeout = new Promise((resolve, reject) => {
          const localConnectTimeoutError = new Error(
            'Cannot use local_connect because the connection was timeouted'
          );
          setTimeout(() => {
            reject(localConnectTimeoutError);
          }, 3000);
        });

        await Promise.race([localConnectTimeout, this._connectLocalWait()]);
      } catch (e) {
        // cannot connect local
        this.error(e);
        this._disconnectLocal();
      }
      this._callOnConnect();
    } catch (e) {
      this.error(e);
    }
  }

  protected _connectCloudWait(desired_server?: string) {
    let server = this.options.obniz_server;
    if (desired_server) {
      server = '' + desired_server;
    }

    if (this.socket && this.socket.readyState <= 1) {
      // if already connected or connecting, reset it.
      this._close();
    }

    let url = server + '/obniz/' + this.id + '/ws/1';
    if ((this.constructor as typeof ObnizConnection).isIpAddress(this.id)) {
      url = `ws://${this.id}/`;
    }

    const query: any = [];
    if ((this.constructor as typeof ObnizConnection).version) {
      query.push(
        'obnizjs=' + (this.constructor as typeof ObnizConnection).version
      );
    }
    if (this.options.access_token) {
      query.push('access_token=' + this.options.access_token);
    }
    if (this.wscommand) {
      query.push('accept_binary=true');
    }
    if (query.length > 0) {
      url += '?' + query.join('&');
    }
    this._print_debug('connecting to ' + url);

    return new Promise((resolve, reject) => {
      const release = () => {
        if (redirect) {
          this.off('_cloudConnectRedirect', redirect);
          redirect = null;
        }
        if (ready) {
          this.off('_cloudConnectReady', ready);
          ready = null;
        }
        if (closed) {
          this.off('_cloudConnectClose', closed);
          closed = null;
        }
      };
      let redirect: null | ((host: string) => void) = (host: string) => {
        release();
        this._connectCloudWait(host).then(resolve).catch(reject);
      };
      this.once('_cloudConnectRedirect', redirect);

      let ready: (() => void) | null = () => {
        release();
        resolve();
      };
      this.once('_cloudConnectReady', ready);

      let closed: (() => void) | null = () => {
        release();
        reject(new Error('Connection closed'));
      };
      this.once('_cloudConnectClose', closed);

      this.socket = this._createCloudSocket(url);
    });
  }

  protected _createCloudSocket(url: string) {
    const socket = new wsClient(url);
    socket.on('open', () => {
      this.wsOnOpen();
    });
    socket.on('message', (msg) => {
      this.wsOnMessage(msg);
    });
    socket.on('close', (event) => {
      this.wsOnClose(event);
    });
    socket.on('error', (err) => {
      this.wsOnError(err);
    });
    socket.on('unexpected-response', (req: any, res?: any) => {
      this.wsOnUnexpectedResponse(req, res);
    });
    return socket;
  }

  protected _connectLocalWait() {
    const host = this._localConnectIp;
    if (!host || !this.wscommand || !this.options.local_connect) {
      return;
      // cannot local connect
      // throw new Error(
      //   'Cannot use local_connect because target device is on a different network'
      // );
    }
    if (!this._canConnectToInsecure()) {
      return;
      // cannot local connect
      // throw new Error(
      //   'Cannot use local_connect because this page use HTTP protocol'
      // );
    }

    const url = 'ws://' + host;
    this._print_debug('local connect to ' + url);
    const ws = new wsClient(url);
    ws.on('open', () => {
      this._print_debug('connected to ' + url);
      this.emit('_localConnectReady');
    });
    ws.on('message', (data: any) => {
      this._print_debug('recvd via local');
      this.wsOnMessage(data);
    });
    ws.on('close', (event: any) => {
      this.log('local websocket closed');
      this._disconnectLocal();
    });
    ws.on('error', (err: any) => {
      console.error('local websocket error.', err);
      this._disconnectLocal();
    });
    ws.on('unexpected-response', (event: any) => {
      this.log('local websocket closed');
      this._disconnectLocal();
    });

    this.socket_local = ws;

    return new Promise((resolve, reject) => {
      this.once('_localConnectReady', resolve);
      this.once('_localConnectClose', () => {
        reject(
          new Error(
            'Cannot use local_connect because the connection was rejected'
          )
        );
      });
    });
  }

  protected _disconnectLocal() {
    if (this.socket_local) {
      if (this.socket_local.readyState <= 1) {
        this.socket_local.close();
      }
      this._clearSocket(this.socket_local);
      delete this.socket_local;
    }
    this.emit('_localConnectClose');
  }

  protected _disconnectCloudRequest() {
    if (this.socket) {
      if (this.socket.readyState <= 1) {
        // Connecting & Connected
        this.connectionState = 'closing';
        this.socket.close(1000, 'close');
      }
    }
  }

  protected _disconnectCloud(notify = true) {
    this._disconnectLocal();
    if (this.socket) {
      if (this.socket.readyState <= 1) {
        this.socket.close(1000, 'close');
      }
      this._clearSocket(this.socket);
      delete this.socket;
    }
    if (notify) {
      this.emit('_cloudConnectClose');
    }
  }

  protected _clearSocket(socket: wsClient) {
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

    const shouldRemoveObservers = [
      'open',
      'message',
      'close',
      'error',
      'unexpected-response',
    ];
    for (let i = 0; i < shouldRemoveObservers.length; i++) {
      socket.removeAllListeners(shouldRemoveObservers[i]);
    }
  }

  /**
   * This function will be called before obniz.onconnect called;
   */
  protected _beforeOnConnect() {}

  protected _callOnConnect() {
    this.connectionState = 'connected';
    const currentTime = new Date().getTime();
    this._lastDataReceivedAt = currentTime; // reset

    this._beforeOnConnect();
    this.emit('connect', this);
    let promise: any;
    this._onConnectCalled = true;
    if (typeof this.onconnect === 'function') {
      promise = this._runUserCreatedFunction(this.onconnect, this);
    }
    this._startPingLoopInBackground();
    if (promise instanceof Promise) {
      promise.finally(() => {
        this._startLoopInBackground();
      });
    } else {
      this._startLoopInBackground();
    }
  }

  protected _print_debug(str: any) {
    if (this.debugprint) {
      this.log(str);
    }
  }

  protected _sendRouted(data: any) {
    if (
      this.socket_local &&
      this.socket_local.readyState === 1 &&
      typeof data !== 'string'
    ) {
      this._print_debug('send via local');
      this.socket_local.send(data);
      if (this.socket_local.bufferedAmount > this.bufferdAmoundWarnBytes) {
        this.warning(
          'over ' + this.socket_local.bufferedAmount + ' bytes queued'
        );
      }
      return;
    }

    if (this.socket && this.socket.readyState === 1) {
      this.socket.send(data);
      if (this.socket.bufferedAmount > this.bufferdAmoundWarnBytes) {
        this.warning('over ' + this.socket.bufferedAmount + ' bytes queued');
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
    if (this._sendQueueTimer) {
      clearTimeout(this._sendQueueTimer);
      this._sendQueueTimer = null;
    }
  }

  protected _notifyToModule(obj: any) {
    if (this.debugprint) {
      this._print_debug(JSON.stringify(obj));
    }

    if (obj.ws) {
      this._handleWSCommand(obj.ws);
      return;
    }
    if (obj.system) {
      this._handleSystemCommand(obj.system);
      return;
    }
  }

  protected _canConnectToInsecure() {
    if (this.isNode) {
      return true;
    } else {
      return location.protocol !== 'https:';
    }
  }

  protected _handleWSCommand(wsObj: any) {
    if (wsObj.ready) {
      this.firmware_ver = wsObj.obniz.firmware;
      this.hw = wsObj.obniz.hw;
      if (!this.hw) {
        this.hw = 'obnizb1';
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
      if (wsObj.obniz.metadata) {
        try {
          this.metadata = JSON.parse(wsObj.obniz.metadata);
        } catch (e) {
          // ignore parsing error.
        }
      }

      if (wsObj.local_connect && wsObj.local_connect.ip) {
        this._localConnectIp = wsObj.local_connect.ip;
      }
      this.emit('_cloudConnectReady');
    }
    if (wsObj.redirect) {
      const urlString: string = wsObj.redirect;
      this._print_debug('WS connection changed to ' + urlString);

      const url = new URL(urlString);
      const host = url.origin;
      const paths = url.pathname;
      if (paths && paths.split('/').length === 5) {
        // migrate obnizID
        this.id = paths.split('/')[2];
      }

      /* close current ws immediately */
      this._disconnectCloud(false);
      this.emit('_cloudConnectRedirect', host);
    }
  }

  protected _handleSystemCommand(wsObj: any) {}

  protected _binary2Json(binary: any) {
    let data = new Uint8Array(binary);
    const json: any = [];
    while (data !== null) {
      const frame = WSCommand.dequeueOne(data);
      if (!frame) {
        break;
      }
      const obj: any = {};
      for (let i = 0; i < this.wscommands.length; i++) {
        const command = this.wscommands[i];
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
      this._nextLoopTimeout = null;
      if (this.connectionState === 'connected') {
        try {
          if (typeof this.onloop === 'function') {
            await this.pingWait();
            const prom: any = (this.onloop as (obniz: this) => void)(this);
            if (prom instanceof Promise) {
              await prom;
            }
          }
        } catch (e) {
          console.error(
            `obniz.js handled Exception inside of obniz.repeat() function`
          );
          console.error(e);
        } finally {
          if (this.connectionState === 'connected') {
            if (!this._nextLoopTimeout) {
              let interval = this._repeatInterval;
              if (typeof this.onloop !== 'function') {
                interval = 100;
              }
              this._nextLoopTimeout = setTimeout(
                this._startLoopInBackground.bind(this),
                interval
              );
            }
          }
        }
      }
    }, 0);
  }

  private _stopLoopInBackground() {
    if (this._nextLoopTimeout) {
      clearTimeout(this._nextLoopTimeout);
      this._nextLoopTimeout = null;
    }
  }

  private _startAutoConnectLoopInBackground() {
    if (!this.autoConnect) {
      return;
    }
    this.connectionState = 'connecting';
    this._connectionRetryCount++;
    let tryAfter = this._connectionRetryCount === 1 ? 0 : 1000;

    if (this._connectionRetryCount > 15) {
      tryAfter = (this._connectionRetryCount - 15) * 1000;
      const Limit: any = this.isNode ? 60 * 1000 : 10 * 1000;
      if (tryAfter > Limit) {
        tryAfter = Limit;
      }
    }

    this._stopAutoConnectLoopInBackground();

    this._nextAutoConnectLoopTimeout = setTimeout(async () => {
      if (this._nextAutoConnectLoopTimeout) {
        clearTimeout(this._nextAutoConnectLoopTimeout);
      }
      this._nextAutoConnectLoopTimeout = null;
      if (!this.autoConnect) {
        return;
      }
      try {
        await this.tryWsConnectOnceWait();
      } catch (e) {
        // cannot connect
        console.error(e);
        this._startAutoConnectLoopInBackground();
      }
    }, tryAfter);
  }

  private _stopAutoConnectLoopInBackground() {
    if (this._nextAutoConnectLoopTimeout) {
      clearTimeout(this._nextAutoConnectLoopTimeout);
      this._nextAutoConnectLoopTimeout = null;
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
      this._nextPingTimeout = null;
      if (this.connectionState === 'connected') {
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
            if (this.connectionState !== 'connected') {
              // already closed
            } else if (time !== this._lastDataReceivedAt) {
              // this will be disconnect -> reconnect while pingWait
            } else {
              // ping error or timeout
              // this.error("ping/pong response timeout error");
              this.wsOnClose('ping/pong response timeout error');
              return;
            }
          }
        } else {
          // this.log("ping/pong not need");
        }

        if (this.connectionState === 'connected') {
          if (!this._nextPingTimeout) {
            this._nextPingTimeout = setTimeout(
              this._startPingLoopInBackground.bind(this),
              loopInterval
            );
          }
        }
      }
    }, 0);
  }

  protected throwErrorIfOffline() {
    if (this.connectionState !== 'connected') {
      throw new ObnizOfflineError();
    }
  }
}
