"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObnizConnection = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const ws_1 = __importDefault(require("ws"));
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const package_1 = __importDefault(require("../../package")); // pakcage.js will be created from package.json on build.
const wscommand_1 = require("./libs/wscommand");
const ObnizError_1 = require("./ObnizError");
class ObnizConnection extends eventemitter3_1.default {
    constructor(id, options) {
        super();
        this._measureTraffic = null;
        this.socket = null;
        this.socket_local = null;
        this.wsCommandManager = wscommand_1.WSCommandManagerInstance;
        this._sendQueueTimer = null;
        this._sendQueue = null;
        this._waitForLocalConnectReadyTimer = null;
        this._sendPool = null;
        this._repeatInterval = 100;
        this._isLoopProcessing = false;
        this._nextLoopTimeout = null;
        this._nextPingTimeout = null;
        this._nextAutoConnectLoopTimeout = null;
        this._lastDataReceivedAt = 0;
        this._localConnectIp = null;
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
            reset_obniz_on_ws_disconnection: options.reset_obniz_on_ws_disconnection === false ? false : true,
            obnizid_dialog: options.obnizid_dialog === false ? false : true,
        };
        this.wsCommandManager.createCommandInstances();
        if (this.autoConnect) {
            this._startAutoConnectLoopInBackground();
        }
    }
    /**
     * obniz.js version
     */
    static get version() {
        return package_1.default.version;
    }
    static isIpAddress(str) {
        const regex = /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/;
        return regex.exec(str) !== null;
    }
    get autoConnect() {
        return this.options.auto_connect;
    }
    set autoConnect(val) {
        const before = this.options.auto_connect;
        this.options.auto_connect = !!val;
        if (before !== this.options.auto_connect) {
            if (this.options.auto_connect) {
                this._startAutoConnectLoopInBackground();
            }
            else {
                this._stopAutoConnectLoopInBackground();
            }
        }
    }
    startCommandPool() {
        this._sendPool = [];
    }
    endCommandPool() {
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
    async connectWait(option) {
        option = option || {};
        const timeout = option.timeout || null;
        if (this.connectionState === 'connected') {
            return true;
        }
        if (!this.autoConnect) {
            // only try once
            try {
                await this.tryWsConnectOnceWait();
                return true;
            }
            catch (e) {
                return false;
            }
        }
        return new Promise((resolve, reject) => {
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
    connect() {
        if (this.connectionState === 'connected' ||
            this.connectionState === 'connecting') {
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
    close() {
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
    async closeWait() {
        this.autoConnect = false;
        if (this.connectionState === 'connecting' ||
            this.connectionState === 'connected' ||
            this.connectionState === 'closing') {
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
    send(obj, options) {
        options = options || {};
        options.local_connect = options.local_connect !== false;
        options.connect_check = options.connect_check !== false;
        if (options.connect_check && this.connectionState !== 'connected') {
            throw new ObnizError_1.ObnizOfflineError();
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
            if (this.options.binary && options.local_connect) {
                let compressed;
                try {
                    compressed = this.wsCommandManager.compress(JSON.parse(sendData)[0]);
                    if (compressed) {
                        sendData = compressed;
                        if (this.debugprintBinary) {
                            this.log('binalized: ' + new Uint8Array(compressed).toString());
                        }
                    }
                }
                catch (e) {
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
            }
            else {
                if (this._sendQueue) {
                    this._sendQueue.push(sendData);
                }
                else {
                    this._sendQueue = [sendData];
                    this._sendQueueTimer = setTimeout(this._drainQueued.bind(this), 0);
                }
            }
        }
        catch (e) {
            this.log(e);
        }
    }
    /**
     * @ignore
     * @param msg
     */
    warning(msg) {
        this.log('warning:' + msg);
    }
    /**
     * @ignore
     * @param msg
     */
    error(msg) {
        console.error(`[obniz ${this.id}] error:${msg.message}`);
    }
    /**
     * @ignore
     */
    log(...args) {
        console.log(new Date(), `[obniz ${this.id}]`, ...args);
    }
    /**
     * @ignore
     * @private
     */
    _runUserCreatedFunction(func, ...args) {
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
        }
        catch (err) {
            console.error(`obniz.js handled Exception inside of ${func}`);
            setTimeout(() => {
                throw err;
            });
        }
        return promise;
    }
    /**
     * Sets the execution interval of onLoop function.
     * Changes will be reflected after the next onloop is executed.
     *
     * @param interval interval of execution in milliseconds.
     */
    setLoopInterval(interval) {
        this._repeatInterval = interval;
    }
    /**
     * Set onloop function. Use onloop property instead. This is deprecated function.
     *
     * @param callback
     * @param interval  default 100. It mean 100ms interval loop.
     * @deprecated
     */
    repeat(callback, interval) {
        if (this.onloop) {
            this.onloop = callback;
            this._repeatInterval = interval || this._repeatInterval || 100;
            return;
        }
        this.onloop = callback;
        this._repeatInterval = interval || 100;
    }
    _close() {
        this._stopLoopInBackground();
        this._drainQueued();
        this._disconnectLocal();
        this._disconnectCloud();
        this._onConnectCalled = false;
    }
    wsOnOpen() {
        this._print_debug('ws connected');
        this._connectionRetryCount = 0;
        // wait for {ws:{ready:true}} object
        if (typeof this.onopen === 'function') {
            this.onopen(this);
        }
    }
    wsOnMessage(data) {
        if (Array.isArray(data)) {
            for (const b of data) {
                this.wsOnMessage(data);
            }
            return;
        }
        this._lastDataReceivedAt = new Date().getTime();
        if (this._measureTraffic) {
            const trafficSize = this._calcTrafficSize(data, this._measureTraffic.ceilByte);
            this._measureTraffic.readByte += trafficSize;
            this._measureTraffic.readCount++;
        }
        try {
            let json;
            if (typeof data === 'string') {
                json = JSON.parse(data);
            }
            else {
                const binary = new Uint8Array(data);
                // binary
                if (this.debugprintBinary) {
                    this.log('binalized: ' + binary.toString());
                }
                json = this.wsCommandManager.binary2Json(binary);
            }
            if (Array.isArray(json)) {
                for (const i in json) {
                    this._notifyToModule(json[i]);
                }
            }
            else {
                // invalid json
            }
        }
        catch (e) {
            console.error(e);
            this.error(e);
        }
    }
    wsOnClose(event) {
        this._print_debug(`closed from remote event=${event}`);
        this.connectionState = 'closing';
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
        this._stopPingLoopInBackground();
    }
    wsOnError(event) {
        this._print_debug(`ws onerror event=${event}`);
    }
    wsOnUnexpectedResponse(req, res) {
        if (res && res.statusCode === 404) {
            this._print_debug('obniz not online');
        }
        else {
            this._print_debug('invalid server response ' + res ? res.statusCode : '');
        }
        this._disconnectCloudRequest();
    }
    async tryWsConnectOnceWait(desired_server) {
        this.connectionState = 'connecting';
        await this._connectCloudWait(desired_server);
        try {
            let localConnectTimeoutRef;
            const localConnectTimeout = new Promise((resolve, reject) => {
                const localConnectTimeoutError = new Error('Cannot use local_connect because the connection was timeouted');
                localConnectTimeoutRef = setTimeout(() => {
                    reject(localConnectTimeoutError);
                }, 3000);
            });
            await Promise.race([localConnectTimeout, this._connectLocalWait()]);
            if (localConnectTimeoutRef) {
                clearTimeout(localConnectTimeoutRef);
            }
        }
        catch (e) {
            // cannot connect local
            this.error(e);
            this._disconnectLocal();
        }
        this._callOnConnect();
    }
    _connectCloudWait(desired_server) {
        let server = this.options.obniz_server;
        if (desired_server) {
            server = '' + desired_server;
        }
        if (this.socket && this.socket.readyState <= 1) {
            // if already connected or connecting, reset it.
            this._close();
        }
        let url = server + '/obniz/' + this.id + '/ws/1';
        if (this.constructor.isIpAddress(this.id)) {
            url = `ws://${this.id}/`;
        }
        const query = [];
        if (this.constructor.version) {
            query.push('obnizjs=' + this.constructor.version);
        }
        if (this.options.access_token) {
            query.push('access_token=' + this.options.access_token);
        }
        if (this.options.binary) {
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
            let redirect = (host) => {
                release();
                this._connectCloudWait(host).then(resolve).catch(reject);
            };
            this.once('_cloudConnectRedirect', redirect);
            let ready = () => {
                release();
                resolve();
            };
            this.once('_cloudConnectReady', ready);
            let closed = () => {
                release();
                reject(new Error('Connection closed'));
            };
            this.once('_cloudConnectClose', closed);
            this.socket = this._createCloudSocket(url);
        });
    }
    _createCloudSocket(url) {
        const socket = new ws_1.default(url);
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
        socket.on('unexpected-response', (req, res) => {
            this.wsOnUnexpectedResponse(req, res);
        });
        return socket;
    }
    _connectLocalWait() {
        const host = this._localConnectIp;
        if (!host || !this.options.binary || !this.options.local_connect) {
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
        const ws = new ws_1.default(url);
        ws.on('open', () => {
            this._print_debug('connected to ' + url);
            this.emit('_localConnectReady');
        });
        ws.on('message', (data) => {
            this._print_debug('recvd via local');
            this.wsOnMessage(data);
        });
        ws.on('close', (event) => {
            this.log('local websocket closed');
            this._disconnectLocal();
        });
        ws.on('error', (err) => {
            console.error('local websocket error.', err);
            this._disconnectLocal();
        });
        ws.on('unexpected-response', (event) => {
            this.log('local websocket closed');
            this._disconnectLocal();
        });
        this.socket_local = ws;
        return new Promise((resolve, reject) => {
            this.once('_localConnectReady', resolve);
            this.once('_localConnectClose', () => {
                reject(new Error('Cannot use local_connect because the connection was rejected'));
            });
        });
    }
    _disconnectLocal() {
        if (this.socket_local) {
            if (this.socket_local.readyState <= 1) {
                this.socket_local.close();
            }
            this._clearSocket(this.socket_local);
            this.socket_local = null;
        }
        this.emit('_localConnectClose');
    }
    _disconnectCloudRequest() {
        if (this.socket) {
            if (this.socket.readyState <= 1) {
                // Connecting & Connected
                this.connectionState = 'closing';
                this.socket.close(1000, 'close');
            }
        }
    }
    _disconnectCloud(notify = true) {
        this._disconnectLocal();
        if (this.socket) {
            if (this.socket.readyState <= 1) {
                this.socket.close(1000, 'close');
            }
            this._clearSocket(this.socket);
            this.socket = null;
        }
        if (notify) {
            this.emit('_cloudConnectClose');
        }
    }
    _clearSocket(socket) {
        if (!socket) {
            return;
        }
        /* send queue */
        if (this._sendQueueTimer) {
            this._sendQueue = null;
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
    _beforeOnConnect() {
        // do nothing.
    }
    _callOnConnect() {
        this.connectionState = 'connected';
        const currentTime = new Date().getTime();
        this._lastDataReceivedAt = currentTime; // reset
        this._beforeOnConnect();
        this.emit('connect', this);
        let promise;
        this._onConnectCalled = true;
        if (typeof this.onconnect === 'function') {
            promise = this._runUserCreatedFunction(this.onconnect, this);
        }
        this._startPingLoopInBackground();
        if (promise instanceof Promise) {
            promise.finally(() => {
                this._startLoopInBackgroundWait();
            });
        }
        else {
            this._startLoopInBackgroundWait();
        }
    }
    _print_debug(str) {
        if (this.debugprint) {
            this.log(str);
        }
    }
    _sendRouted(data) {
        if (this._measureTraffic) {
            const trafficSize = this._calcTrafficSize(data, this._measureTraffic.ceilByte);
            this._measureTraffic.sendByte += trafficSize;
            this._measureTraffic.sendCount++;
        }
        if (this.socket_local &&
            this.socket_local.readyState === 1 &&
            typeof data !== 'string') {
            this._print_debug('send via local');
            this.socket_local.send(data);
            if (this.socket_local.bufferedAmount > this.bufferdAmoundWarnBytes) {
                this.warning('over ' + this.socket_local.bufferedAmount + ' bytes queued');
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
    _drainQueued() {
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
        this._sendQueue = null;
        if (this._sendQueueTimer) {
            clearTimeout(this._sendQueueTimer);
            this._sendQueueTimer = null;
        }
    }
    _notifyToModule(obj) {
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
    _canConnectToInsecure() {
        if (this.isNode) {
            return true;
        }
        else {
            return location.protocol !== 'https:';
        }
    }
    _handleWSCommand(wsObj) {
        if (wsObj.ready) {
            const wsObniz = wsObj.obniz;
            this.firmware_ver = wsObniz.firmware;
            this.hw = wsObniz.hw;
            if (!this.hw) {
                this.hw = 'obnizb1';
            }
            this.wsCommandManager.setHw({
                hw: this.hw,
                firmware: this.firmware_ver,
            });
            if (this.options.reset_obniz_on_ws_disconnection) {
                this.resetOnDisconnect(true);
            }
            if (wsObniz.metadata) {
                try {
                    this.metadata = JSON.parse(wsObj.obniz.metadata);
                }
                catch (e) {
                    // ignore parsing error.
                }
            }
            if (wsObniz.connected_network) {
                this.connected_network = wsObniz.connected_network;
            }
            if (wsObj.local_connect && wsObj.local_connect.ip) {
                this._localConnectIp = wsObj.local_connect.ip;
            }
            this.emit('_cloudConnectReady');
        }
        if (wsObj.redirect) {
            const urlString = wsObj.redirect;
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
    _handleSystemCommand(wsObj) {
        // do nothing.
    }
    async _startLoopInBackgroundWait() {
        this._stopLoopInBackground();
        if (this._isLoopProcessing || this.connectionState !== 'connected') {
            return;
        }
        this._isLoopProcessing = true;
        try {
            if (typeof this.onloop === 'function') {
                await this.onloop(this);
            }
        }
        catch (e) {
            console.error(`obniz.js handled Exception inside of obniz.onloop function`);
            console.error(e);
        }
        this._isLoopProcessing = false;
        if (this._nextLoopTimeout || this.connectionState !== 'connected') {
            return;
        }
        const interval = typeof this.onloop === 'function' ? this._repeatInterval : 100;
        this._nextLoopTimeout = setTimeout(this._startLoopInBackgroundWait.bind(this), interval);
    }
    _stopLoopInBackground() {
        if (this._nextLoopTimeout) {
            clearTimeout(this._nextLoopTimeout);
            this._nextLoopTimeout = null;
        }
    }
    _startAutoConnectLoopInBackground() {
        if (!this.autoConnect) {
            return;
        }
        this.connectionState = 'connecting';
        this._connectionRetryCount++;
        let tryAfter = this._connectionRetryCount === 1 ? 0 : 1000;
        if (this._connectionRetryCount > 15) {
            tryAfter = (this._connectionRetryCount - 15) * 1000;
            const Limit = this.isNode ? 60 * 1000 : 10 * 1000;
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
            }
            catch (e) {
                // cannot connect
                this._startAutoConnectLoopInBackground();
            }
        }, tryAfter);
    }
    _stopAutoConnectLoopInBackground() {
        if (this._nextAutoConnectLoopTimeout) {
            clearTimeout(this._nextAutoConnectLoopTimeout);
            this._nextAutoConnectLoopTimeout = null;
        }
    }
    _startPingLoopInBackground() {
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
                    }
                    catch (e) {
                        if (this.connectionState !== 'connected') {
                            // already closed
                        }
                        else if (time !== this._lastDataReceivedAt) {
                            // this will be disconnect -> reconnect while pingWait
                        }
                        else {
                            // ping error or timeout
                            // this.error("ping/pong response timeout error");
                            this.wsOnClose('ping/pong response timeout error');
                            return;
                        }
                    }
                }
                else {
                    // this.log("ping/pong not need");
                }
                if (this.connectionState === 'connected') {
                    if (!this._nextPingTimeout) {
                        this._nextPingTimeout = setTimeout(this._startPingLoopInBackground.bind(this), loopInterval);
                    }
                }
            }
        }, 0);
    }
    _stopPingLoopInBackground() {
        if (this._nextPingTimeout) {
            clearTimeout(this._nextPingTimeout);
            this._nextPingTimeout = null;
        }
    }
    throwErrorIfOffline() {
        if (this.connectionState !== 'connected') {
            throw new ObnizError_1.ObnizOfflineError();
        }
    }
    startTrafficMeasurement(ceil = 1) {
        if (!this.socket_local) {
            throw new Error('Cannot measure traffic data outside of local connect');
        }
        if (!this._measureTraffic) {
            this._measureTraffic = {
                ceilByte: ceil,
                readByte: 0,
                readCount: 0,
                sendByte: 0,
                sendCount: 0,
            };
        }
    }
    getTrafficData() {
        if (!this._measureTraffic) {
            return {
                readByte: 0,
                readCount: 0,
                sendByte: 0,
                sendCount: 0,
                ceilByte: 1,
            };
        }
        return {
            readByte: this._measureTraffic.readByte,
            readCount: this._measureTraffic.readCount,
            sendByte: this._measureTraffic.sendByte,
            sendCount: this._measureTraffic.sendCount,
            ceilByte: this._measureTraffic.ceilByte,
        };
    }
    resetTrafficMeasurement() {
        if (this._measureTraffic) {
            const data = this.getTrafficData();
            this._measureTraffic = {
                ceilByte: this._measureTraffic.ceilByte,
                readByte: 0,
                readCount: 0,
                sendByte: 0,
                sendCount: 0,
            };
            return data;
        }
        return null;
    }
    endTrafficMeasurement() {
        const data = this.getTrafficData();
        this._measureTraffic = null;
        return data;
    }
    _calcTrafficSize(data, ceil) {
        let trafficSize;
        if (data instanceof Buffer) {
            trafficSize = data.length;
        }
        else if (data instanceof ArrayBuffer) {
            trafficSize = data.byteLength;
        }
        else {
            trafficSize = data.length * 8;
        }
        const ceiledTrafficSize = Math.round(Math.ceil(trafficSize / ceil) * ceil);
        return ceiledTrafficSize;
    }
}
exports.ObnizConnection = ObnizConnection;
