"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const emitter = require("eventemitter3");
// @ts-ignore
const package_json_1 = __importDefault(require("../../package.json"));
const wscommand_1 = __importDefault(require("./libs/wscommand"));
const isNode = typeof window === "undefined";
class ObnizConnection {
    constructor(id, options) {
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
    prompt(filled, callback) {
        const obnizid = prompt("Please enter obniz id", filled);
        if (obnizid) {
            callback(obnizid);
        }
    }
    static get version() {
        return package_json_1.default.version;
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
        let json;
        if (typeof data === "string") {
            json = JSON.parse(data);
        }
        else if (this.wscommands) {
            if (this.debugprintBinary) {
                console.log("Obniz: binalized: " + new Uint8Array(data).toString());
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
        this.print_debug("closed");
        this.close();
        this.emitter.emit("closed");
        if (typeof this.onclose === "function" && this.onConnectCalled === true) {
            this.onclose(this);
        }
        this.onConnectCalled = false;
        this._reconnect();
    }
    connectWait(option) {
        option = option || {};
        const timeout = option.timeout || null;
        return new Promise((resolve, reject) => {
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
    _reconnect() {
        this._connectionRetryCount++;
        let tryAfter = 1000;
        if (this._connectionRetryCount > 15) {
            tryAfter = (this._connectionRetryCount - 15) * 1000;
            const Limit = isNode ? 60 * 1000 : 10 * 1000;
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
        // console.error(event);
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
            // @ts-ignore
            import wsClient = require("ws");
            socket = new wsClient(url);
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
            // @ts-ignore
            import wsClient = require("ws");
            ws = new wsClient(url);
            ws.on("open", () => {
                this.print_debug("connected to " + url);
                this._callOnConnect();
            });
            ws.on("message", (data) => {
                this.print_debug("recvd via local");
                this.wsOnMessage(data);
            });
            ws.on("close", (event) => {
                console.log("local websocket closed");
                this._disconnectLocal();
            });
            ws.on("error", (err) => {
                console.error("local websocket error.", err);
                this._disconnectLocal();
            });
            ws.on("unexpected-response", (event) => {
                console.log("local websocket closed");
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
                console.log("local websocket closed");
                this._disconnectLocal();
            };
            ws.onerror = (err) => {
                console.log("local websocket error.", err);
                this._disconnectLocal();
            };
        }
        this.socket_local = ws;
    }
    _disconnectLocal() {
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
            const shouldRemoveObservers = [
                "open",
                "message",
                "close",
                "error",
                "unexpected-response",
            ];
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
    connect() {
        if (this.socket && this.socket.readyState <= 1) {
            return;
        }
        this.wsconnect();
    }
    close() {
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
        this.emitter.emit("connected");
        if (canChangeToConnected) {
            this.connectionState = "connected";
            if (typeof this.onconnect === "function") {
                const promise = this.onconnect(this);
                if (promise instanceof Promise) {
                    promise.catch((err) => {
                        console.error(err);
                    });
                }
            }
            this.onConnectCalled = true;
        }
    }
    print_debug(str) {
        if (this.debugprint) {
            console.log("Obniz: " + str);
        }
    }
    send(obj, options) {
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
            let sendData = JSON.stringify([obj]);
            if (this.debugprint) {
                this.print_debug("send: " + sendData);
            }
            /* compress */
            if (this.wscommand &&
                (typeof options !== "object" || options.local_connect !== false)) {
                let compressed;
                try {
                    compressed = this.wscommand.compress(this.wscommands, JSON.parse(sendData)[0]);
                    if (compressed) {
                        sendData = compressed;
                        if (this.debugprintBinary) {
                            console.log("Obniz: binalized: " + new Uint8Array(compressed).toString());
                        }
                    }
                }
                catch (e) {
                    this.error("------ errored json -------");
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
            console.log(e);
        }
    }
    _sendRouted(data) {
        if (this.socket_local &&
            this.socket_local.readyState === 1 &&
            typeof data !== "string") {
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
    handleSystemCommand(wsObj) {
    }
    static get WSCommand() {
        return wscommand_1.default;
    }
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
    warning(msg) {
        console.log("warning:" + msg);
    }
    error(msg) {
        console.error("error:" + msg);
    }
}
exports.default = ObnizConnection;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9PYm5pekNvbm5lY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx5Q0FBMEM7QUFFMUMsYUFBYTtBQUNiLHNFQUE2QztBQUM3QyxpRUFBeUM7QUFDekMsTUFBTSxNQUFNLEdBQVEsT0FBTyxNQUFNLEtBQUssV0FBVyxDQUFDO0FBRWxELE1BQXFCLGVBQWU7SUEyQmxDLFlBQVksRUFBTyxFQUFFLE9BQVk7UUFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO1FBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQzdCLElBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO1FBQzlCLElBQUksQ0FBQyxlQUFlLEdBQUcsUUFBUSxDQUFDLENBQUMsc0NBQXNDO1FBQ3ZFLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLFlBQVk7UUFDNUQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO1FBRTdCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxDQUFDLENBQUM7UUFFL0IsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU8sR0FBRyxFQUFFLENBQUM7U0FDZDtRQUNELElBQUksQ0FBQyxPQUFPLEdBQUc7WUFDYixNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sS0FB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QVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQy9DLE1BQU0sT0FBTyxHQUFRLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUMsTUFBTSxFQUFFO29CQUNuQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN6RCxNQUFNO2lCQUNQO2FBQ0Y7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7U0FDbkI7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxPQUFPLENBQUMsR0FBUTtRQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRU0sS0FBSyxDQUFDLEdBQVE7UUFDbkIsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDaEMsQ0FBQztDQUNGO0FBNW1CRCxrQ0E0bUJDIiwiZmlsZSI6InNyYy9vYm5pei9PYm5pekNvbm5lY3Rpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZW1pdHRlciA9IHJlcXVpcmUoXCJldmVudGVtaXR0ZXIzXCIpO1xuXG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgcGFja2FnZUpzb24gZnJvbSBcIi4uLy4uL3BhY2thZ2UuanNvblwiO1xuaW1wb3J0IFdTQ29tbWFuZCBmcm9tIFwiLi9saWJzL3dzY29tbWFuZFwiO1xuY29uc3QgaXNOb2RlOiBhbnkgPSB0eXBlb2Ygd2luZG93ID09PSBcInVuZGVmaW5lZFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPYm5pekNvbm5lY3Rpb24ge1xuXG4gIHB1YmxpYyBpc05vZGU6IGJvb2xlYW47XG4gIHB1YmxpYyBpZDogYW55O1xuICBwdWJsaWMgc29ja2V0OiBhbnk7XG4gIHB1YmxpYyBzb2NrZXRfbG9jYWw6IGFueTtcbiAgcHVibGljIGRlYnVncHJpbnQ6IGJvb2xlYW47XG4gIHB1YmxpYyBkZWJ1Z3ByaW50QmluYXJ5OiBib29sZWFuO1xuICBwdWJsaWMgZGVidWdzOiBhbnk7XG4gIHB1YmxpYyBvbkNvbm5lY3RDYWxsZWQ6IGJvb2xlYW47XG4gIHB1YmxpYyBodzogYW55O1xuICBwdWJsaWMgZmlybXdhcmVfdmVyOiBhbnk7XG4gIHB1YmxpYyBjb25uZWN0aW9uU3RhdGU6IFwiY2xvc2VkXCIgfCBcImNvbm5lY3RpbmdcIiB8IFwiY29ubmVjdGVkXCIgfCBcImNsb3NpbmdcIjtcbiAgcHVibGljIGJ1ZmZlcmRBbW91bmRXYXJuQnl0ZXM6IG51bWJlcjtcbiAgcHVibGljIGVtaXR0ZXI6IGFueTtcbiAgcHVibGljIG9wdGlvbnM6IGFueTtcbiAgcHVibGljIHdzY29tbWFuZDogYW55O1xuICBwdWJsaWMgd3Njb21tYW5kczogYW55O1xuICBwdWJsaWMgX3NlbmRRdWV1ZVRpbWVyOiBhbnk7XG4gIHB1YmxpYyBfc2VuZFF1ZXVlOiBhbnk7XG4gIHB1YmxpYyBfd2FpdEZvckxvY2FsQ29ubmVjdFJlYWR5VGltZXI6IGFueTtcbiAgcHVibGljIF9jb25uZWN0aW9uUmV0cnlDb3VudDogbnVtYmVyO1xuICBwdWJsaWMgb25vcGVuOiBhbnk7XG4gIHB1YmxpYyBvbmNsb3NlOiBhbnk7XG4gIHB1YmxpYyBvbmNvbm5lY3Q6IGFueTtcbiAgcHVibGljIHNlbmRQb29sOiBhbnk7XG5cbiAgY29uc3RydWN0b3IoaWQ6IGFueSwgb3B0aW9uczogYW55KSB7XG4gICAgdGhpcy5pc05vZGUgPSBpc05vZGU7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMuc29ja2V0ID0gbnVsbDtcbiAgICB0aGlzLnNvY2tldF9sb2NhbCA9IG51bGw7XG4gICAgdGhpcy5kZWJ1Z3ByaW50ID0gZmFsc2U7XG4gICAgdGhpcy5kZWJ1Z3ByaW50QmluYXJ5ID0gZmFsc2U7XG4gICAgdGhpcy5kZWJ1Z3MgPSBbXTtcbiAgICB0aGlzLm9uQ29ubmVjdENhbGxlZCA9IGZhbHNlO1xuICAgIHRoaXMuaHcgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5maXJtd2FyZV92ZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jb25uZWN0aW9uU3RhdGUgPSBcImNsb3NlZFwiOyAvLyBjbG9zZWQvY29ubmVjdGluZy9jb25uZWN0ZWQvY2xvc2luZ1xuICAgIHRoaXMuYnVmZmVyZEFtb3VuZFdhcm5CeXRlcyA9IDEwICogMTAwMCAqIDEwMDA7IC8vIDEwTSBieXRlc1xuICAgIHRoaXMuZW1pdHRlciA9IG5ldyBlbWl0dGVyKCk7XG5cbiAgICB0aGlzLl9jb25uZWN0aW9uUmV0cnlDb3VudCA9IDA7XG5cbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgYmluYXJ5OiBvcHRpb25zLmJpbmFyeSA9PT0gZmFsc2UgPyBmYWxzZSA6IHRydWUsXG4gICAgICBsb2NhbF9jb25uZWN0OiBvcHRpb25zLmxvY2FsX2Nvbm5lY3QgPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlLFxuICAgICAgZGVidWdfZG9tX2lkOiBvcHRpb25zLmRlYnVnX2RvbV9pZCB8fCBcIm9ibml6LWRlYnVnXCIsXG4gICAgICBhdXRvX2Nvbm5lY3Q6IG9wdGlvbnMuYXV0b19jb25uZWN0ID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgIGFjY2Vzc190b2tlbjogb3B0aW9ucy5hY2Nlc3NfdG9rZW4gfHwgbnVsbCxcbiAgICAgIG9ibml6X3NlcnZlcjogb3B0aW9ucy5vYm5pel9zZXJ2ZXIgfHwgXCJ3c3M6Ly9vYm5pei5pb1wiLFxuICAgICAgcmVzZXRfb2JuaXpfb25fd3NfZGlzY29ubmVjdGlvbjpcbiAgICAgICAgb3B0aW9ucy5yZXNldF9vYm5pel9vbl93c19kaXNjb25uZWN0aW9uID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZSxcbiAgICB9O1xuICAgIGlmICh0aGlzLm9wdGlvbnMuYmluYXJ5KSB7XG4gICAgICB0aGlzLndzY29tbWFuZCA9ICh0aGlzLmNvbnN0cnVjdG9yIGFzIHR5cGVvZiBPYm5pekNvbm5lY3Rpb24pLldTQ29tbWFuZDtcbiAgICAgIGNvbnN0IGNsYXNzZXM6IGFueSA9ICh0aGlzLmNvbnN0cnVjdG9yIGFzIHR5cGVvZiBPYm5pekNvbm5lY3Rpb24pLldTQ29tbWFuZC5Db21tYW5kQ2xhc3NlcztcbiAgICAgIHRoaXMud3Njb21tYW5kcyA9IFtdO1xuICAgICAgZm9yIChjb25zdCBjbGFzc19uYW1lIGluIGNsYXNzZXMpIHtcbiAgICAgICAgdGhpcy53c2NvbW1hbmRzLnB1c2goXG4gICAgICAgICAgbmV3IGNsYXNzZXNbY2xhc3NfbmFtZV0oe1xuICAgICAgICAgICAgaHc6IHtcbiAgICAgICAgICAgICAgZmlybXdhcmU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgbW9kZWw6IFwib2JuaXpfYm9hcmRcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZWxlZ2F0ZTogdW5kZWZpbmVkLFxuICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9fY29ubmVjdCkge1xuICAgICAgdGhpcy53c2Nvbm5lY3QoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcHJvbXB0KGZpbGxlZDogYW55LCBjYWxsYmFjazogYW55KSB7XG4gICAgY29uc3Qgb2JuaXppZDogYW55ID0gcHJvbXB0KFwiUGxlYXNlIGVudGVyIG9ibml6IGlkXCIsIGZpbGxlZCk7XG4gICAgaWYgKG9ibml6aWQpIHtcbiAgICAgIGNhbGxiYWNrKG9ibml6aWQpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBnZXQgdmVyc2lvbigpIHtcblxuICAgIHJldHVybiBwYWNrYWdlSnNvbi52ZXJzaW9uO1xuICB9XG5cbiAgcHVibGljIHdzT25PcGVuKCkge1xuICAgIHRoaXMucHJpbnRfZGVidWcoXCJ3cyBjb25uZWN0ZWRcIik7XG4gICAgdGhpcy5fY29ubmVjdGlvblJldHJ5Q291bnQgPSAwO1xuICAgIC8vIHdhaXQgZm9yIHt3czp7cmVhZHk6dHJ1ZX19IG9iamVjdFxuICAgIGlmICh0eXBlb2YgdGhpcy5vbm9wZW4gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdGhpcy5vbm9wZW4odGhpcyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHdzT25NZXNzYWdlKGRhdGE6IGFueSkge1xuICAgIGxldCBqc29uOiBhbnk7XG4gICAgaWYgKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBqc29uID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMud3Njb21tYW5kcykge1xuICAgICAgaWYgKHRoaXMuZGVidWdwcmludEJpbmFyeSkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIk9ibml6OiBiaW5hbGl6ZWQ6IFwiICsgbmV3IFVpbnQ4QXJyYXkoZGF0YSkudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgICBqc29uID0gdGhpcy5iaW5hcnkySnNvbihkYXRhKTtcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShqc29uKSkge1xuICAgICAgZm9yIChjb25zdCBpIGluIGpzb24pIHtcbiAgICAgICAgdGhpcy5ub3RpZnlUb01vZHVsZShqc29uW2ldKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gaW52YWxpZCBqc29uXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHdzT25DbG9zZShldmVudDogYW55KSB7XG4gICAgdGhpcy5wcmludF9kZWJ1ZyhcImNsb3NlZFwiKTtcbiAgICB0aGlzLmNsb3NlKCk7XG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoXCJjbG9zZWRcIik7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9uY2xvc2UgPT09IFwiZnVuY3Rpb25cIiAmJiB0aGlzLm9uQ29ubmVjdENhbGxlZCA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5vbmNsb3NlKHRoaXMpO1xuICAgIH1cbiAgICB0aGlzLm9uQ29ubmVjdENhbGxlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5fcmVjb25uZWN0KCk7XG4gIH1cblxuICBwdWJsaWMgY29ubmVjdFdhaXQob3B0aW9uOiBhbnkpIHtcbiAgICBvcHRpb24gPSBvcHRpb24gfHwge307XG4gICAgY29uc3QgdGltZW91dDogYW55ID0gb3B0aW9uLnRpbWVvdXQgfHwgbnVsbDtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZTogYW55LCByZWplY3Q6IGFueSkgPT4ge1xuICAgICAgaWYgKHRoaXMub25Db25uZWN0Q2FsbGVkKSB7XG4gICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuZW1pdHRlci5vbmNlKFwiY29ubmVjdGVkXCIsICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKCF0aGlzLm9wdGlvbnMuYXV0b19jb25uZWN0KSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5vbmNlKFwiY2xvc2VkXCIsICgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAodGltZW91dCkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgfSwgdGltZW91dCAqIDEwMDApO1xuICAgICAgfVxuICAgICAgdGhpcy5jb25uZWN0KCk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgX3JlY29ubmVjdCgpIHtcbiAgICB0aGlzLl9jb25uZWN0aW9uUmV0cnlDb3VudCsrO1xuICAgIGxldCB0cnlBZnRlcjogYW55ID0gMTAwMDtcbiAgICBpZiAodGhpcy5fY29ubmVjdGlvblJldHJ5Q291bnQgPiAxNSkge1xuICAgICAgdHJ5QWZ0ZXIgPSAodGhpcy5fY29ubmVjdGlvblJldHJ5Q291bnQgLSAxNSkgKiAxMDAwO1xuICAgICAgY29uc3QgTGltaXQ6IGFueSA9IGlzTm9kZSA/IDYwICogMTAwMCA6IDEwICogMTAwMDtcbiAgICAgIGlmICh0cnlBZnRlciA+IExpbWl0KSB7XG4gICAgICAgIHRyeUFmdGVyID0gTGltaXQ7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMuYXV0b19jb25uZWN0KSB7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy53c2Nvbm5lY3QoKTsgLy8gYWx3YXlzIGNvbm5lY3QgdG8gbWFpbnNlcnZlciBpZiB3cyBsb3N0XG4gICAgICB9LCB0cnlBZnRlcik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHdzT25FcnJvcihldmVudDogYW55KSB7XG4gICAgLy8gY29uc29sZS5lcnJvcihldmVudCk7XG4gIH1cblxuICBwdWJsaWMgd3NPblVuZXhwZWN0ZWRSZXNwb25zZShyZXE6IGFueSwgcmVzPzogYW55KSB7XG4gICAgaWYgKHJlcyAmJiByZXMuc3RhdHVzQ29kZSA9PT0gNDA0KSB7XG4gICAgICB0aGlzLnByaW50X2RlYnVnKFwib2JuaXogbm90IG9ubGluZVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcmludF9kZWJ1ZyhcImludmFsaWQgc2VydmVyIHJlc3BvbnNlIFwiICsgcmVzID8gcmVzLnN0YXR1c0NvZGUgOiBcIlwiKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsZWFyU29ja2V0KHRoaXMuc29ja2V0KTtcbiAgICBkZWxldGUgdGhpcy5zb2NrZXQ7XG5cbiAgICB0aGlzLl9yZWNvbm5lY3QoKTtcbiAgfVxuXG4gIHB1YmxpYyB3c2Nvbm5lY3QoZGVzaXJlZF9zZXJ2ZXI/OiBhbnkpIHtcbiAgICBsZXQgc2VydmVyOiBhbnkgPSB0aGlzLm9wdGlvbnMub2JuaXpfc2VydmVyO1xuICAgIGlmIChkZXNpcmVkX3NlcnZlcikge1xuICAgICAgc2VydmVyID0gXCJcIiArIGRlc2lyZWRfc2VydmVyO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlIDw9IDEpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9XG5cbiAgICBsZXQgdXJsOiBhbnkgPSBzZXJ2ZXIgKyBcIi9vYm5pei9cIiArIHRoaXMuaWQgKyBcIi93cy8xXCI7XG5cbiAgICBjb25zdCBxdWVyeTogYW55ID0gW107XG4gICAgaWYgKCh0aGlzLmNvbnN0cnVjdG9yIGFzIHR5cGVvZiBPYm5pekNvbm5lY3Rpb24pLnZlcnNpb24pIHtcbiAgICAgIHF1ZXJ5LnB1c2goXCJvYm5pempzPVwiICsgKHRoaXMuY29uc3RydWN0b3IgYXMgdHlwZW9mIE9ibml6Q29ubmVjdGlvbikudmVyc2lvbik7XG4gICAgfVxuICAgIGlmICh0aGlzLm9wdGlvbnMuYWNjZXNzX3Rva2VuKSB7XG4gICAgICBxdWVyeS5wdXNoKFwiYWNjZXNzX3Rva2VuPVwiICsgdGhpcy5vcHRpb25zLmFjY2Vzc190b2tlbik7XG4gICAgfVxuICAgIGlmICh0aGlzLndzY29tbWFuZCkge1xuICAgICAgcXVlcnkucHVzaChcImFjY2VwdF9iaW5hcnk9dHJ1ZVwiKTtcbiAgICB9XG4gICAgaWYgKHF1ZXJ5Lmxlbmd0aCA+IDApIHtcbiAgICAgIHVybCArPSBcIj9cIiArIHF1ZXJ5LmpvaW4oXCImXCIpO1xuICAgIH1cbiAgICB0aGlzLnByaW50X2RlYnVnKFwiY29ubmVjdGluZyB0byBcIiArIHVybCk7XG5cbiAgICBsZXQgc29ja2V0OiBhbnk7XG4gICAgaWYgKHRoaXMuaXNOb2RlKSB7XG5cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGltcG9ydCB3c0NsaWVudCA9IHJlcXVpcmUoXCJ3c1wiKTtcbiAgICAgIHNvY2tldCA9IG5ldyB3c0NsaWVudCh1cmwpO1xuICAgICAgc29ja2V0Lm9uKFwib3BlblwiLCB0aGlzLndzT25PcGVuLmJpbmQodGhpcykpO1xuICAgICAgc29ja2V0Lm9uKFwibWVzc2FnZVwiLCB0aGlzLndzT25NZXNzYWdlLmJpbmQodGhpcykpO1xuICAgICAgc29ja2V0Lm9uKFwiY2xvc2VcIiwgdGhpcy53c09uQ2xvc2UuYmluZCh0aGlzKSk7XG4gICAgICBzb2NrZXQub24oXCJlcnJvclwiLCB0aGlzLndzT25FcnJvci5iaW5kKHRoaXMpKTtcbiAgICAgIHNvY2tldC5vbihcInVuZXhwZWN0ZWQtcmVzcG9uc2VcIiwgdGhpcy53c09uVW5leHBlY3RlZFJlc3BvbnNlLmJpbmQodGhpcykpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KHVybCk7XG4gICAgICBzb2NrZXQuYmluYXJ5VHlwZSA9IFwiYXJyYXlidWZmZXJcIjtcbiAgICAgIHNvY2tldC5vbm9wZW4gPSB0aGlzLndzT25PcGVuLmJpbmQodGhpcyk7XG4gICAgICBzb2NrZXQub25tZXNzYWdlID0gKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgdGhpcy53c09uTWVzc2FnZShldmVudC5kYXRhKTtcbiAgICAgIH07XG4gICAgICBzb2NrZXQub25jbG9zZSA9IHRoaXMud3NPbkNsb3NlLmJpbmQodGhpcyk7XG4gICAgICBzb2NrZXQub25lcnJvciA9IHRoaXMud3NPbkVycm9yLmJpbmQodGhpcyk7XG4gICAgfVxuICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuXG4gICAgdGhpcy5jb25uZWN0aW9uU3RhdGUgPSBcImNvbm5lY3RpbmdcIjtcbiAgfVxuXG4gIHB1YmxpYyBfY29ubmVjdExvY2FsKGhvc3Q6IGFueSkge1xuICAgIGNvbnN0IHVybDogYW55ID0gXCJ3czovL1wiICsgaG9zdDtcbiAgICB0aGlzLnByaW50X2RlYnVnKFwibG9jYWwgY29ubmVjdCB0byBcIiArIHVybCk7XG4gICAgbGV0IHdzOiBhbnk7XG4gICAgaWYgKHRoaXMuaXNOb2RlKSB7XG5cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGltcG9ydCB3c0NsaWVudCA9IHJlcXVpcmUoXCJ3c1wiKTtcblxuICAgICAgd3MgPSBuZXcgd3NDbGllbnQodXJsKTtcbiAgICAgIHdzLm9uKFwib3BlblwiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMucHJpbnRfZGVidWcoXCJjb25uZWN0ZWQgdG8gXCIgKyB1cmwpO1xuICAgICAgICB0aGlzLl9jYWxsT25Db25uZWN0KCk7XG4gICAgICB9KTtcbiAgICAgIHdzLm9uKFwibWVzc2FnZVwiLCAoZGF0YTogYW55KSA9PiB7XG4gICAgICAgIHRoaXMucHJpbnRfZGVidWcoXCJyZWN2ZCB2aWEgbG9jYWxcIik7XG4gICAgICAgIHRoaXMud3NPbk1lc3NhZ2UoZGF0YSk7XG4gICAgICB9KTtcbiAgICAgIHdzLm9uKFwiY2xvc2VcIiwgKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJsb2NhbCB3ZWJzb2NrZXQgY2xvc2VkXCIpO1xuICAgICAgICB0aGlzLl9kaXNjb25uZWN0TG9jYWwoKTtcbiAgICAgIH0pO1xuICAgICAgd3Mub24oXCJlcnJvclwiLCAoZXJyOiBhbnkpID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcImxvY2FsIHdlYnNvY2tldCBlcnJvci5cIiwgZXJyKTtcbiAgICAgICAgdGhpcy5fZGlzY29ubmVjdExvY2FsKCk7XG4gICAgICB9KTtcbiAgICAgIHdzLm9uKFwidW5leHBlY3RlZC1yZXNwb25zZVwiLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcImxvY2FsIHdlYnNvY2tldCBjbG9zZWRcIik7XG4gICAgICAgIHRoaXMuX2Rpc2Nvbm5lY3RMb2NhbCgpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHdzID0gbmV3IFdlYlNvY2tldCh1cmwpO1xuICAgICAgd3MuYmluYXJ5VHlwZSA9IFwiYXJyYXlidWZmZXJcIjtcbiAgICAgIHdzLm9ub3BlbiA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5wcmludF9kZWJ1ZyhcImNvbm5lY3RlZCB0byBcIiArIHVybCk7XG4gICAgICAgIHRoaXMuX2NhbGxPbkNvbm5lY3QoKTtcbiAgICAgIH07XG4gICAgICB3cy5vbm1lc3NhZ2UgPSAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICB0aGlzLnByaW50X2RlYnVnKFwicmVjdmQgdmlhIGxvY2FsXCIpO1xuICAgICAgICB0aGlzLndzT25NZXNzYWdlKGV2ZW50LmRhdGEpO1xuICAgICAgfTtcbiAgICAgIHdzLm9uY2xvc2UgPSAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcImxvY2FsIHdlYnNvY2tldCBjbG9zZWRcIik7XG4gICAgICAgIHRoaXMuX2Rpc2Nvbm5lY3RMb2NhbCgpO1xuICAgICAgfTtcbiAgICAgIHdzLm9uZXJyb3IgPSAoZXJyOiBhbnkpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJsb2NhbCB3ZWJzb2NrZXQgZXJyb3IuXCIsIGVycik7XG4gICAgICAgIHRoaXMuX2Rpc2Nvbm5lY3RMb2NhbCgpO1xuICAgICAgfTtcbiAgICB9XG4gICAgdGhpcy5zb2NrZXRfbG9jYWwgPSB3cztcbiAgfVxuXG4gIHB1YmxpYyBfZGlzY29ubmVjdExvY2FsKCkge1xuICAgIGlmICh0aGlzLnNvY2tldF9sb2NhbCkge1xuICAgICAgaWYgKHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPD0gMSkge1xuICAgICAgICB0aGlzLnNvY2tldF9sb2NhbC5jbG9zZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5jbGVhclNvY2tldCh0aGlzLnNvY2tldF9sb2NhbCk7XG4gICAgICBkZWxldGUgdGhpcy5zb2NrZXRfbG9jYWw7XG4gICAgfVxuICAgIGlmICh0aGlzLl93YWl0Rm9yTG9jYWxDb25uZWN0UmVhZHlUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3dhaXRGb3JMb2NhbENvbm5lY3RSZWFkeVRpbWVyKTtcbiAgICAgIHRoaXMuX3dhaXRGb3JMb2NhbENvbm5lY3RSZWFkeVRpbWVyID0gbnVsbDtcbiAgICAgIHRoaXMuX2NhbGxPbkNvbm5lY3QoKTsgLyogc2hvdWxkIGNhbGwuIG9ubHlsIGxvY2FsIGNvbm5lY3Qgd2FzIGxvc3QuIGFuZCB3YWl0aW5nLiAqL1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBjbGVhclNvY2tldChzb2NrZXQ6IGFueSkge1xuICAgIGlmICghc29ja2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8qIHNlbmQgcXVldWUgKi9cbiAgICBpZiAodGhpcy5fc2VuZFF1ZXVlVGltZXIpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9zZW5kUXVldWU7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fc2VuZFF1ZXVlVGltZXIpO1xuICAgICAgdGhpcy5fc2VuZFF1ZXVlVGltZXIgPSBudWxsO1xuICAgIH1cbiAgICAvKiB1bmJpbmQgKi9cbiAgICBpZiAodGhpcy5pc05vZGUpIHtcbiAgICAgIGNvbnN0IHNob3VsZFJlbW92ZU9ic2VydmVyczogYW55ID0gW1xuICAgICAgICBcIm9wZW5cIixcbiAgICAgICAgXCJtZXNzYWdlXCIsXG4gICAgICAgIFwiY2xvc2VcIixcbiAgICAgICAgXCJlcnJvclwiLFxuICAgICAgICBcInVuZXhwZWN0ZWQtcmVzcG9uc2VcIixcbiAgICAgIF07XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNob3VsZFJlbW92ZU9ic2VydmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBzb2NrZXQucmVtb3ZlQWxsTGlzdGVuZXJzKHNob3VsZFJlbW92ZU9ic2VydmVyc1tpXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHNvY2tldC5vbm9wZW4gPSBudWxsO1xuICAgICAgc29ja2V0Lm9ubWVzc2FnZSA9IG51bGw7XG4gICAgICBzb2NrZXQub25jbG9zZSA9IG51bGw7XG4gICAgICBzb2NrZXQub25lcnJvciA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGNvbm5lY3QoKSB7XG4gICAgaWYgKHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPD0gMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLndzY29ubmVjdCgpO1xuICB9XG5cbiAgcHVibGljIGNsb3NlKCkge1xuICAgIHRoaXMuX2RyYWluUXVldWVkKCk7XG4gICAgdGhpcy5fZGlzY29ubmVjdExvY2FsKCk7XG4gICAgaWYgKHRoaXMuc29ja2V0KSB7XG4gICAgICBpZiAodGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA8PSAxKSB7XG4gICAgICAgIC8vIENvbm5lY3RpbmcgJiBDb25uZWN0ZWRcbiAgICAgICAgdGhpcy5jb25uZWN0aW9uU3RhdGUgPSBcImNsb3NpbmdcIjtcbiAgICAgICAgdGhpcy5zb2NrZXQuY2xvc2UoMTAwMCwgXCJjbG9zZVwiKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2xlYXJTb2NrZXQodGhpcy5zb2NrZXQpO1xuICAgICAgZGVsZXRlIHRoaXMuc29ja2V0O1xuICAgIH1cbiAgICB0aGlzLmNvbm5lY3Rpb25TdGF0ZSA9IFwiY2xvc2VkXCI7XG4gIH1cblxuICBwdWJsaWMgX2NhbGxPbkNvbm5lY3QoKSB7XG4gICAgbGV0IGNhbkNoYW5nZVRvQ29ubmVjdGVkOiBhbnkgPSB0cnVlO1xuICAgIGlmICh0aGlzLl93YWl0Rm9yTG9jYWxDb25uZWN0UmVhZHlUaW1lcikge1xuICAgICAgLyogb2JuaXouanMgY2FuJ3Qgd2FpdCBmb3IgbG9jYWxfY29ubmVjdCBhbnkgbW9yZSEgKi9cbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLl93YWl0Rm9yTG9jYWxDb25uZWN0UmVhZHlUaW1lcik7XG4gICAgICB0aGlzLl93YWl0Rm9yTG9jYWxDb25uZWN0UmVhZHlUaW1lciA9IG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8qIG9ibml6LmpzIGhhcyB0byB3YWl0IGZvciBsb2NhbF9jb25uZWN0IGVzdGFibGlzaCAqL1xuICAgICAgaWYgKHRoaXMuc29ja2V0X2xvY2FsICYmIHRoaXMuc29ja2V0X2xvY2FsLnJlYWR5U3RhdGUgPT09IDEpIHtcbiAgICAgICAgLyogZGVsYXllZCBjb25uZWN0ICovXG4gICAgICAgIGNhbkNoYW5nZVRvQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvKiBsb2NhbF9jb25uZWN0IGlzIG5vdCB1c2VkICovXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5lbWl0dGVyLmVtaXQoXCJjb25uZWN0ZWRcIik7XG5cbiAgICBpZiAoY2FuQ2hhbmdlVG9Db25uZWN0ZWQpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvblN0YXRlID0gXCJjb25uZWN0ZWRcIjtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vbmNvbm5lY3QgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBjb25zdCBwcm9taXNlOiBhbnkgPSB0aGlzLm9uY29ubmVjdCh0aGlzKTtcbiAgICAgICAgaWYgKHByb21pc2UgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgcHJvbWlzZS5jYXRjaCgoZXJyOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5vbkNvbm5lY3RDYWxsZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBwcmludF9kZWJ1ZyhzdHI6IGFueSkge1xuICAgIGlmICh0aGlzLmRlYnVncHJpbnQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiT2JuaXo6IFwiICsgc3RyKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2VuZChvYmo6IGFueSwgb3B0aW9ucz86IGFueSkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwib2JuaXpqcy4gZGlkbnQgc2VuZCBcIiwgb2JqKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkob2JqKSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRoaXMuc2VuZChvYmpbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnNlbmRQb29sKSB7XG4gICAgICAgIHRoaXMuc2VuZFBvb2wucHVzaChvYmopO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBzZW5kRGF0YTogYW55ID0gSlNPTi5zdHJpbmdpZnkoW29ial0pO1xuICAgICAgaWYgKHRoaXMuZGVidWdwcmludCkge1xuICAgICAgICB0aGlzLnByaW50X2RlYnVnKFwic2VuZDogXCIgKyBzZW5kRGF0YSk7XG4gICAgICB9XG5cbiAgICAgIC8qIGNvbXByZXNzICovXG4gICAgICBpZiAoXG4gICAgICAgIHRoaXMud3Njb21tYW5kICYmXG4gICAgICAgICh0eXBlb2Ygb3B0aW9ucyAhPT0gXCJvYmplY3RcIiB8fCBvcHRpb25zLmxvY2FsX2Nvbm5lY3QgIT09IGZhbHNlKVxuICAgICAgKSB7XG4gICAgICAgIGxldCBjb21wcmVzc2VkOiBhbnk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29tcHJlc3NlZCA9IHRoaXMud3Njb21tYW5kLmNvbXByZXNzKFxuICAgICAgICAgICAgdGhpcy53c2NvbW1hbmRzLFxuICAgICAgICAgICAgSlNPTi5wYXJzZShzZW5kRGF0YSlbMF0sXG4gICAgICAgICAgKTtcbiAgICAgICAgICBpZiAoY29tcHJlc3NlZCkge1xuICAgICAgICAgICAgc2VuZERhdGEgPSBjb21wcmVzc2VkO1xuICAgICAgICAgICAgaWYgKHRoaXMuZGVidWdwcmludEJpbmFyeSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICBcIk9ibml6OiBiaW5hbGl6ZWQ6IFwiICsgbmV3IFVpbnQ4QXJyYXkoY29tcHJlc3NlZCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICB0aGlzLmVycm9yKFwiLS0tLS0tIGVycm9yZWQganNvbiAtLS0tLS0tXCIpO1xuICAgICAgICAgIHRoaXMuZXJyb3Ioc2VuZERhdGEpO1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyogcXVldWUgc2VuZGluZyAqL1xuICAgICAgaWYgKHR5cGVvZiBzZW5kRGF0YSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0aGlzLl9kcmFpblF1ZXVlZCgpO1xuICAgICAgICB0aGlzLl9zZW5kUm91dGVkKHNlbmREYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLl9zZW5kUXVldWUpIHtcbiAgICAgICAgICB0aGlzLl9zZW5kUXVldWUucHVzaChzZW5kRGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fc2VuZFF1ZXVlID0gW3NlbmREYXRhXTtcbiAgICAgICAgICB0aGlzLl9zZW5kUXVldWVUaW1lciA9IHNldFRpbWVvdXQodGhpcy5fZHJhaW5RdWV1ZWQuYmluZCh0aGlzKSwgMCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgX3NlbmRSb3V0ZWQoZGF0YTogYW55KSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy5zb2NrZXRfbG9jYWwgJiZcbiAgICAgIHRoaXMuc29ja2V0X2xvY2FsLnJlYWR5U3RhdGUgPT09IDEgJiZcbiAgICAgIHR5cGVvZiBkYXRhICE9PSBcInN0cmluZ1wiXG4gICAgKSB7XG4gICAgICB0aGlzLnByaW50X2RlYnVnKFwic2VuZCB2aWEgbG9jYWxcIik7XG4gICAgICB0aGlzLnNvY2tldF9sb2NhbC5zZW5kKGRhdGEpO1xuICAgICAgaWYgKHRoaXMuc29ja2V0X2xvY2FsLmJ1ZmZlcmVkQW1vdW50ID4gdGhpcy5idWZmZXJkQW1vdW5kV2FybkJ5dGVzKSB7XG4gICAgICAgIHRoaXMud2FybmluZyhcbiAgICAgICAgICBcIm92ZXIgXCIgKyB0aGlzLnNvY2tldF9sb2NhbC5idWZmZXJlZEFtb3VudCArIFwiIGJ5dGVzIHF1ZXVlZFwiLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNvY2tldCAmJiB0aGlzLnNvY2tldC5yZWFkeVN0YXRlID09PSAxKSB7XG4gICAgICB0aGlzLnNvY2tldC5zZW5kKGRhdGEpO1xuICAgICAgaWYgKHRoaXMuc29ja2V0LmJ1ZmZlcmVkQW1vdW50ID4gdGhpcy5idWZmZXJkQW1vdW5kV2FybkJ5dGVzKSB7XG4gICAgICAgIHRoaXMud2FybmluZyhcIm92ZXIgXCIgKyB0aGlzLnNvY2tldC5idWZmZXJlZEFtb3VudCArIFwiIGJ5dGVzIHF1ZXVlZFwiKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgX2RyYWluUXVldWVkKCkge1xuICAgIGlmICghdGhpcy5fc2VuZFF1ZXVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBleHBlY3RTaXplOiBhbnkgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc2VuZFF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBleHBlY3RTaXplICs9IHRoaXMuX3NlbmRRdWV1ZVtpXS5sZW5ndGg7XG4gICAgfVxuICAgIGxldCBmaWxsZWQ6IGFueSA9IDA7XG4gICAgY29uc3Qgc2VuZERhdGE6IGFueSA9IG5ldyBVaW50OEFycmF5KGV4cGVjdFNpemUpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc2VuZFF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzZW5kRGF0YS5zZXQodGhpcy5fc2VuZFF1ZXVlW2ldLCBmaWxsZWQpO1xuICAgICAgZmlsbGVkICs9IHRoaXMuX3NlbmRRdWV1ZVtpXS5sZW5ndGg7XG4gICAgfVxuICAgIHRoaXMuX3NlbmRSb3V0ZWQoc2VuZERhdGEpO1xuICAgIGRlbGV0ZSB0aGlzLl9zZW5kUXVldWU7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX3NlbmRRdWV1ZVRpbWVyKTtcbiAgICB0aGlzLl9zZW5kUXVldWVUaW1lciA9IG51bGw7XG4gIH1cblxuICBwdWJsaWMgbm90aWZ5VG9Nb2R1bGUob2JqOiBhbnkpIHtcbiAgICBpZiAodGhpcy5kZWJ1Z3ByaW50KSB7XG4gICAgICB0aGlzLnByaW50X2RlYnVnKEpTT04uc3RyaW5naWZ5KG9iaikpO1xuICAgIH1cblxuICAgIGlmIChvYmoud3MpIHtcbiAgICAgIHRoaXMuaGFuZGxlV1NDb21tYW5kKG9iai53cyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChvYmouc3lzdGVtKSB7XG4gICAgICB0aGlzLmhhbmRsZVN5c3RlbUNvbW1hbmQob2JqLnN5c3RlbSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgcHVibGljIF9jYW5Db25uZWN0VG9JbnNlY3VyZSgpIHtcbiAgICBpZiAodGhpcy5pc05vZGUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbG9jYXRpb24ucHJvdG9jb2wgIT09IFwiaHR0cHM6XCI7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGhhbmRsZVdTQ29tbWFuZCh3c09iajogYW55KSB7XG4gICAgaWYgKHdzT2JqLnJlYWR5KSB7XG4gICAgICB0aGlzLmZpcm13YXJlX3ZlciA9IHdzT2JqLm9ibml6LmZpcm13YXJlO1xuICAgICAgdGhpcy5odyA9IHdzT2JqLm9ibml6Lmh3O1xuICAgICAgaWYgKCF0aGlzLmh3KSB7XG4gICAgICAgIHRoaXMuaHcgPSBcIm9ibml6YjFcIjtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLndzY29tbWFuZHMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndzY29tbWFuZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBjb21tYW5kOiBhbnkgPSB0aGlzLndzY29tbWFuZHNbaV07XG4gICAgICAgICAgY29tbWFuZC5zZXRIdyh7XG4gICAgICAgICAgICBodzogdGhpcy5odywgLy8gaGFyZCBjb2RpbmdcbiAgICAgICAgICAgIGZpcm13YXJlOiB0aGlzLmZpcm13YXJlX3ZlcixcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5yZXNldF9vYm5pel9vbl93c19kaXNjb25uZWN0aW9uKSB7XG4gICAgICAgICh0aGlzIGFzIGFueSkucmVzZXRPbkRpc2Nvbm5lY3QodHJ1ZSk7XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgIHdzT2JqLmxvY2FsX2Nvbm5lY3QgJiZcbiAgICAgICAgd3NPYmoubG9jYWxfY29ubmVjdC5pcCAmJlxuICAgICAgICB0aGlzLndzY29tbWFuZCAmJlxuICAgICAgICB0aGlzLm9wdGlvbnMubG9jYWxfY29ubmVjdCAmJlxuICAgICAgICB0aGlzLl9jYW5Db25uZWN0VG9JbnNlY3VyZSgpXG4gICAgICApIHtcbiAgICAgICAgdGhpcy5fY29ubmVjdExvY2FsKHdzT2JqLmxvY2FsX2Nvbm5lY3QuaXApO1xuICAgICAgICB0aGlzLl93YWl0Rm9yTG9jYWxDb25uZWN0UmVhZHlUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2NhbGxPbkNvbm5lY3QoKTtcbiAgICAgICAgfSwgMzAwMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jYWxsT25Db25uZWN0KCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh3c09iai5yZWRpcmVjdCkge1xuICAgICAgY29uc3Qgc2VydmVyOiBhbnkgPSB3c09iai5yZWRpcmVjdDtcbiAgICAgIHRoaXMucHJpbnRfZGVidWcoXCJXUyBjb25uZWN0aW9uIGNoYW5nZWQgdG8gXCIgKyBzZXJ2ZXIpO1xuXG4gICAgICAvKiBjbG9zZSBjdXJyZW50IHdzIGltbWlkaWF0ZWx5ICovXG4gICAgICAvKiAgKi9cbiAgICAgIHRoaXMuc29ja2V0LmNsb3NlKDEwMDAsIFwiY2xvc2VcIik7XG4gICAgICB0aGlzLmNsZWFyU29ja2V0KHRoaXMuc29ja2V0KTtcbiAgICAgIGRlbGV0ZSB0aGlzLnNvY2tldDtcblxuICAgICAgLyogY29ubmVjdCB0byBuZXcgc2VydmVyICovXG4gICAgICB0aGlzLndzY29ubmVjdChzZXJ2ZXIpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVTeXN0ZW1Db21tYW5kKHdzT2JqOiBhbnkpIHtcbiAgfVxuXG4gIHN0YXRpYyBnZXQgV1NDb21tYW5kKCkge1xuICAgIHJldHVybiBXU0NvbW1hbmQ7XG4gIH1cblxuICBwdWJsaWMgYmluYXJ5Mkpzb24oYmluYXJ5OiBhbnkpIHtcbiAgICBsZXQgZGF0YTogYW55ID0gbmV3IFVpbnQ4QXJyYXkoYmluYXJ5KTtcbiAgICBjb25zdCBqc29uOiBhbnkgPSBbXTtcbiAgICB3aGlsZSAoZGF0YSAhPT0gbnVsbCkge1xuICAgICAgY29uc3QgZnJhbWU6IGFueSA9IFdTQ29tbWFuZC5kZXF1ZXVlT25lKGRhdGEpO1xuICAgICAgaWYgKCFmcmFtZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNvbnN0IG9iajogYW55ID0ge307XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMud3Njb21tYW5kcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBjb21tYW5kOiBhbnkgPSB0aGlzLndzY29tbWFuZHNbaV07XG4gICAgICAgIGlmIChjb21tYW5kLm1vZHVsZSA9PT0gZnJhbWUubW9kdWxlKSB7XG4gICAgICAgICAgY29tbWFuZC5ub3RpZnlGcm9tQmluYXJ5KG9iaiwgZnJhbWUuZnVuYywgZnJhbWUucGF5bG9hZCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGpzb24ucHVzaChvYmopO1xuICAgICAgZGF0YSA9IGZyYW1lLm5leHQ7XG4gICAgfVxuICAgIHJldHVybiBqc29uO1xuICB9XG5cbiAgcHVibGljIHdhcm5pbmcobXNnOiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZyhcIndhcm5pbmc6XCIgKyBtc2cpO1xuICB9XG5cbiAgcHVibGljIGVycm9yKG1zZzogYW55KSB7XG4gICAgY29uc29sZS5lcnJvcihcImVycm9yOlwiICsgbXNnKTtcbiAgfVxufVxuIl19
