"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const ws_1 = __importDefault(require("ws"));
// @ts-ignore
const package_1 = __importDefault(require("../../package")); // pakcage.js will be created from package.json on build.
const wscommand_1 = __importDefault(require("./libs/wscommand"));
const ObnizError_1 = require("./ObnizError");
class ObnizConnection extends eventemitter3_1.default {
    constructor(id, options) {
        super();
        this._lastDataReceivedAt = 0;
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
            this.wscommand = this.constructor.WSCommand;
            const classes = this.constructor.WSCommand.CommandClasses;
            this.wscommands = [];
            for (const class_name in classes) {
                this.wscommands.push(new classes[class_name]({
                    hw: {
                        firmware: undefined,
                        model: "obniz_board",
                    },
                    delegate: undefined,
                }));
            }
        }
        if (this.options.auto_connect) {
            this.wsconnect();
        }
    }
    /**
     * obniz.js version
     */
    static get version() {
        return package_1.default.version;
    }
    /**
     * @ignore
     * @constructor
     */
    static get WSCommand() {
        return wscommand_1.default;
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
    connectWait(option) {
        option = option || {};
        const timeout = option.timeout || null;
        return new Promise((resolve, reject) => {
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
    connect() {
        if (this.socket && this.socket.readyState <= 1) {
            return;
        }
        this.wsconnect();
    }
    close() {
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
    send(obj, options) {
        options = options || {};
        options.local_connect = options.local_connect !== false;
        options.connect_check = options.connect_check !== false;
        if (options.connect_check && this.connectionState !== "connected") {
            throw new ObnizError_1.ObnizOfflineError();
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
                let compressed;
                try {
                    compressed = this.wscommand.compress(this.wscommands, JSON.parse(sendData)[0]);
                    if (compressed) {
                        sendData = compressed;
                        if (this.debugprintBinary) {
                            this.log("binalized: " + new Uint8Array(compressed).toString());
                        }
                    }
                }
                catch (e) {
                    this.error({ alert: "error", message: "------ errored json -------" });
                    this.error(sendData);
                    throw e;
                }
            }
            /* queue sending */
            if (typeof sendData === "string") {
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
        this.log("warning:" + msg);
    }
    /**
     * @ignore
     * @param msg
     */
    error(msg) {
        console.error(`[obniz ${this.id}] error:${msg}`);
    }
    /**
     * @ignore
     */
    log(...args) {
        console.log(`[obniz ${this.id}]`, ...args);
    }
    /**
     * @ignore
     * @private
     */
    _runUserCreatedFunction(func, ...args) {
        if (!func) {
            return;
        }
        if (typeof func !== "function") {
            return;
        }
        try {
            func(...args);
        }
        catch (err) {
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
    repeat(callback, interval) {
        if (this._looper) {
            this._looper = callback;
            this._repeatInterval = interval || this._repeatInterval || 100;
            return;
        }
        this._looper = callback;
        this._repeatInterval = interval || 100;
    }
    wsOnOpen() {
        this.print_debug("ws connected");
        this._connectionRetryCount = 0;
        // wait for {ws:{ready:true}} object
        if (typeof this.onopen === "function") {
            this.onopen(this);
        }
    }
    wsOnMessage(data) {
        this._lastDataReceivedAt = new Date().getTime();
        let json;
        if (typeof data === "string") {
            json = JSON.parse(data);
        }
        else if (this.wscommands) {
            if (this.debugprintBinary) {
                this.log("binalized: " + new Uint8Array(data).toString());
            }
            json = this.binary2Json(data);
        }
        if (Array.isArray(json)) {
            for (const i in json) {
                this.notifyToModule(json[i]);
            }
        }
        else {
            // invalid json
        }
    }
    wsOnClose(event) {
        this.print_debug(`closed from remote event=${event}`);
        const beforeOnConnectCalled = this._onConnectCalled;
        this.close();
        this.emit("close", this);
        if (beforeOnConnectCalled === true) {
            this._runUserCreatedFunction(this.onclose, this);
        }
        this._reconnect();
    }
    _reconnect() {
        this._connectionRetryCount++;
        let tryAfter = 1000;
        if (this._connectionRetryCount > 15) {
            tryAfter = (this._connectionRetryCount - 15) * 1000;
            const Limit = this.isNode ? 60 * 1000 : 10 * 1000;
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
    wsOnError(event) {
        this.print_debug(`ws onerror event=${event}`);
    }
    wsOnUnexpectedResponse(req, res) {
        if (res && res.statusCode === 404) {
            this.print_debug("obniz not online");
        }
        else {
            this.print_debug("invalid server response " + res ? res.statusCode : "");
        }
        this.clearSocket(this.socket);
        delete this.socket;
        this._reconnect();
    }
    wsconnect(desired_server) {
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
        const query = [];
        if (this.constructor.version) {
            query.push("obnizjs=" + this.constructor.version);
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
        let socket;
        if (this.isNode) {
            socket = new ws_1.default(url);
            socket.on("open", this.wsOnOpen.bind(this));
            socket.on("message", this.wsOnMessage.bind(this));
            socket.on("close", this.wsOnClose.bind(this));
            socket.on("error", this.wsOnError.bind(this));
            socket.on("unexpected-response", this.wsOnUnexpectedResponse.bind(this));
        }
        else {
            socket = new WebSocket(url);
            socket.binaryType = "arraybuffer";
            socket.onopen = this.wsOnOpen.bind(this);
            socket.onmessage = (event) => {
                this.wsOnMessage(event.data);
            };
            socket.onclose = this.wsOnClose.bind(this);
            socket.onerror = this.wsOnError.bind(this);
        }
        this.socket = socket;
        this.connectionState = "connecting";
    }
    _connectLocal(host) {
        const url = "ws://" + host;
        this.print_debug("local connect to " + url);
        let ws;
        if (this.isNode) {
            ws = new ws_1.default(url);
            ws.on("open", () => {
                this.print_debug("connected to " + url);
                this._callOnConnect();
            });
            ws.on("message", (data) => {
                this.print_debug("recvd via local");
                this.wsOnMessage(data);
            });
            ws.on("close", (event) => {
                this.log("local websocket closed");
                this._disconnectLocal();
            });
            ws.on("error", (err) => {
                console.error("local websocket error.", err);
                this._disconnectLocal();
            });
            ws.on("unexpected-response", (event) => {
                this.log("local websocket closed");
                this._disconnectLocal();
            });
        }
        else {
            ws = new WebSocket(url);
            ws.binaryType = "arraybuffer";
            ws.onopen = () => {
                this.print_debug("connected to " + url);
                this._callOnConnect();
            };
            ws.onmessage = (event) => {
                this.print_debug("recvd via local");
                this.wsOnMessage(event.data);
            };
            ws.onclose = (event) => {
                this.log("local websocket closed");
                this._disconnectLocal();
            };
            ws.onerror = (err) => {
                this.log("local websocket error.", err);
                this._disconnectLocal();
            };
        }
        this.socket_local = ws;
    }
    _disconnectLocal() {
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
    clearSocket(socket) {
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
        }
        else {
            socket.onopen = null;
            socket.onmessage = null;
            socket.onclose = null;
            socket.onerror = null;
        }
    }
    /**
     * This function will be called before obniz.onconnect called;
     */
    async _beforeOnConnect() { }
    _callOnConnect() {
        let canChangeToConnected = true;
        if (this._waitForLocalConnectReadyTimer) {
            /* obniz.js can't wait for local_connect any more! */
            clearTimeout(this._waitForLocalConnectReadyTimer);
            this._waitForLocalConnectReadyTimer = null;
        }
        else {
            /* obniz.js has to wait for local_connect establish */
            if (this.socket_local && this.socket_local.readyState === 1) {
                /* delayed connect */
                canChangeToConnected = false;
            }
            else {
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
                    const promise = this.onconnect(this);
                    if (promise instanceof Promise) {
                        promise.catch((err) => {
                            setTimeout(() => {
                                throw err;
                            });
                        });
                    }
                }
                catch (err) {
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
    _isIpAddress(str) {
        const regex = /^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])(\.(?!$)|$)){4}$/;
        return str.match(regex) !== null;
    }
    print_debug(str) {
        if (this.debugprint) {
            this.log(str);
        }
    }
    _sendRouted(data) {
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
        delete this._sendQueue;
        clearTimeout(this._sendQueueTimer);
        this._sendQueueTimer = null;
    }
    notifyToModule(obj) {
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
    _canConnectToInsecure() {
        if (this.isNode) {
            return true;
        }
        else {
            return location.protocol !== "https:";
        }
    }
    handleWSCommand(wsObj) {
        if (wsObj.ready) {
            this.firmware_ver = wsObj.obniz.firmware;
            this.hw = wsObj.obniz.hw;
            if (!this.hw) {
                this.hw = "obnizb1";
            }
            if (this.wscommands) {
                for (let i = 0; i < this.wscommands.length; i++) {
                    const command = this.wscommands[i];
                    command.setHw({
                        hw: this.hw,
                        firmware: this.firmware_ver,
                    });
                }
            }
            if (this.options.reset_obniz_on_ws_disconnection) {
                this.resetOnDisconnect(true);
            }
            if (wsObj.local_connect &&
                wsObj.local_connect.ip &&
                this.wscommand &&
                this.options.local_connect &&
                this._canConnectToInsecure()) {
                this._connectLocal(wsObj.local_connect.ip);
                this._waitForLocalConnectReadyTimer = setTimeout(() => {
                    this._callOnConnect();
                }, 3000);
            }
            else {
                this._callOnConnect();
            }
        }
        if (wsObj.redirect) {
            const server = wsObj.redirect;
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
    handleSystemCommand(wsObj) { }
    binary2Json(binary) {
        let data = new Uint8Array(binary);
        const json = [];
        while (data !== null) {
            const frame = wscommand_1.default.dequeueOne(data);
            if (!frame) {
                break;
            }
            const obj = {};
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
    _startLoopInBackground() {
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
                        const prom = this._looper();
                        if (prom instanceof Promise) {
                            await prom;
                        }
                    }
                }
                catch (e) {
                    console.error(`obniz.js handled Exception inside of obniz.repeat() function`);
                    console.error(e);
                }
                finally {
                    if (this.connectionState === "connected") {
                        if (!this._nextLoopTimeout) {
                            this._nextLoopTimeout = setTimeout(this._startLoopInBackground.bind(this), this._repeatInterval || 100);
                        }
                    }
                }
            }
        }, 0);
    }
    _stopLoopInBackground() {
        if (this._nextLoopTimeout) {
            clearTimeout(this._nextLoopTimeout);
            this._nextLoopTimeout = undefined;
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
                    }
                    catch (e) {
                        if (this.connectionState !== "connected") {
                            // already closed
                        }
                        else if (time !== this._lastDataReceivedAt) {
                            // this will be disconnect -> reconnect while pingWait
                        }
                        else {
                            // ping error or timeout
                            // this.error("ping/pong response timeout error");
                            this.wsOnClose("ping/pong response timeout error");
                            return;
                        }
                    }
                }
                else {
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
exports.default = ObnizConnection;
