"use strict";
const WSCommand = require('./libs/wscommand');
const emitter = require('eventemitter3');
const isNode = typeof window === 'undefined';
module.exports = class ObnizConnection {
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
        this.connectionState = 'closed'; // closed/connecting/connected/closing
        this.bufferdAmoundWarnBytes = 10 * 1000 * 1000; // 10M bytes
        this.emitter = new emitter();
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
        };
        if (this.options.binary) {
            this.wscommand = this.constructor.WSCommand;
            let classes = this.constructor.WSCommand.CommandClasses;
            this.wscommands = [];
            for (let class_name in classes) {
                this.wscommands.push(new classes[class_name]({
                    hw: {
                        firmware: undefined,
                        model: 'obniz_board',
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
        let obnizid = prompt('Please enter obniz id', filled);
        if (obnizid) {
            callback(obnizid);
        }
    }
    static get version() {
        let packageJson = require('../../package.json');
        return packageJson.version;
    }
    wsOnOpen() {
        this.print_debug('ws connected');
        this._connectionRetryCount = 0;
        // wait for {ws:{ready:true}} object
        if (typeof this.onopen === 'function') {
            this.onopen(this);
        }
    }
    wsOnMessage(data) {
        let json;
        if (typeof data === 'string') {
            json = JSON.parse(data);
        }
        else if (this.wscommands) {
            if (this.debugprintBinary) {
                console.log('Obniz: binalized: ' + new Uint8Array(data).toString());
            }
            json = this.binary2Json(data);
        }
        if (Array.isArray(json)) {
            for (let i in json) {
                this.notifyToModule(json[i]);
            }
        }
        else {
            //invalid json
        }
    }
    wsOnClose(event) {
        this.print_debug('closed');
        this.close();
        this.emitter.emit('closed');
        if (typeof this.onclose === 'function' && this.onConnectCalled == true) {
            this.onclose(this);
        }
        this.onConnectCalled = false;
        this._reconnect();
    }
    connectWait(option) {
        option = option || {};
        let timeout = option.timeout || null;
        return new Promise((resolve, reject) => {
            if (this.onConnectCalled) {
                resolve(true);
                return;
            }
            this.emitter.once('connected', () => {
                resolve(true);
            });
            if (!this.options.auto_connect) {
                this.emitter.once('closed', () => {
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
        if (res && res.statusCode == 404) {
            this.print_debug('obniz not online');
        }
        else {
            this.print_debug('invalid server response ' + res ? res.statusCode : '');
        }
        this.clearSocket(this.socket);
        delete this.socket;
        this._reconnect();
    }
    wsconnect(desired_server) {
        let server = this.options.obniz_server;
        if (desired_server) {
            server = '' + desired_server;
        }
        if (this.socket && this.socket.readyState <= 1) {
            this.close();
        }
        let url = server + '/obniz/' + this.id + '/ws/1';
        let query = [];
        if (this.constructor.version) {
            query.push('obnizjs=' + this.constructor.version);
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
        this.print_debug('connecting to ' + url);
        let socket;
        if (this.isNode) {
            const wsClient = require('ws');
            socket = new wsClient(url);
            socket.on('open', this.wsOnOpen.bind(this));
            socket.on('message', this.wsOnMessage.bind(this));
            socket.on('close', this.wsOnClose.bind(this));
            socket.on('error', this.wsOnError.bind(this));
            socket.on('unexpected-response', this.wsOnUnexpectedResponse.bind(this));
        }
        else {
            socket = new WebSocket(url);
            socket.binaryType = 'arraybuffer';
            socket.onopen = this.wsOnOpen.bind(this);
            socket.onmessage = function (event) {
                this.wsOnMessage(event.data);
            }.bind(this);
            socket.onclose = this.wsOnClose.bind(this);
            socket.onerror = this.wsOnError.bind(this);
        }
        this.socket = socket;
        this.connectionState = 'connecting';
    }
    _connectLocal(host) {
        const url = 'ws://' + host;
        this.print_debug('local connect to ' + url);
        let ws;
        if (this.isNode) {
            const wsClient = require('ws');
            ws = new wsClient(url);
            ws.on('open', () => {
                this.print_debug('connected to ' + url);
                this._callOnConnect();
            });
            ws.on('message', data => {
                this.print_debug('recvd via local');
                this.wsOnMessage(data);
            });
            ws.on('close', event => {
                console.log('local websocket closed');
                this._disconnectLocal();
            });
            ws.on('error', err => {
                console.error('local websocket error.', err);
                this._disconnectLocal();
            });
            ws.on('unexpected-response', event => {
                console.log('local websocket closed');
                this._disconnectLocal();
            });
        }
        else {
            ws = new WebSocket(url);
            ws.binaryType = 'arraybuffer';
            ws.onopen = () => {
                this.print_debug('connected to ' + url);
                this._callOnConnect();
            };
            ws.onmessage = event => {
                this.print_debug('recvd via local');
                this.wsOnMessage(event.data);
            };
            ws.onclose = event => {
                console.log('local websocket closed');
                this._disconnectLocal();
            };
            ws.onerror = err => {
                console.log('local websocket error.', err);
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
            let shouldRemoveObservers = [
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
                this.connectionState = 'closing';
                this.socket.close(1000, 'close');
            }
            this.clearSocket(this.socket);
            delete this.socket;
        }
        this.connectionState = 'closed';
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
        this.emitter.emit('connected');
        if (canChangeToConnected) {
            this.connectionState = 'connected';
            if (typeof this.onconnect === 'function') {
                const promise = this.onconnect(this);
                if (promise instanceof Promise) {
                    promise.catch(err => {
                        console.error(err);
                    });
                }
            }
            this.onConnectCalled = true;
        }
    }
    print_debug(str) {
        if (this.debugprint) {
            console.log('Obniz: ' + str);
        }
    }
    send(obj, options) {
        try {
            if (!obj || typeof obj !== 'object') {
                console.log('obnizjs. didnt send ', obj);
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
                this.print_debug('send: ' + sendData);
            }
            /* compress */
            if (this.wscommand &&
                (typeof options !== 'object' || options.local_connect !== false)) {
                let compressed;
                try {
                    compressed = this.wscommand.compress(this.wscommands, JSON.parse(sendData)[0]);
                    if (compressed) {
                        sendData = compressed;
                        if (this.debugprintBinary) {
                            console.log('Obniz: binalized: ' + new Uint8Array(compressed).toString());
                        }
                    }
                }
                catch (e) {
                    this.error('------ errored json -------');
                    this.error(sendData);
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
            console.log(e);
        }
    }
    _sendRouted(data) {
        if (this.socket_local &&
            this.socket_local.readyState === 1 &&
            typeof data !== 'string') {
            this.print_debug('send via local');
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
        let sendData = new Uint8Array(expectSize);
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
            return location.protocol != 'https:';
        }
    }
    handleWSCommand(wsObj) {
        if (wsObj.ready) {
            this.firmware_ver = wsObj.obniz.firmware;
            this.hw = wsObj.obniz.hw;
            if (!this.hw) {
                this.hw = 'obnizb1';
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
            let server = wsObj.redirect;
            this.print_debug('WS connection changed to ' + server);
            /* close current ws immidiately */
            /*  */
            this.socket.close(1000, 'close');
            this.clearSocket(this.socket);
            delete this.socket;
            /* connect to new server */
            this.wsconnect(server);
        }
    }
    handleSystemCommand(wsObj) { }
    static get WSCommand() {
        return WSCommand;
    }
    binary2Json(binary) {
        let data = new Uint8Array(binary);
        let json = [];
        while (data !== null) {
            const frame = WSCommand.dequeueOne(data);
            if (!frame) {
                break;
            }
            let obj = {};
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
        console.log('warning:' + msg);
    }
    error(msg) {
        console.error('error:' + msg);
    }
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9vYm5pei9PYm5pekNvbm5lY3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzlDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUV6QyxNQUFNLE1BQU0sR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLENBQUM7QUFFN0MsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLGVBQWU7SUFDcEMsWUFBWSxFQUFFLEVBQUUsT0FBTztRQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7UUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7UUFDN0IsSUFBSSxDQUFDLEVBQUUsR0FBRyxTQUFTLENBQUM7UUFDcEIsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7UUFDOUIsSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsQ0FBQyxzQ0FBc0M7UUFDdkUsSUFBSSxDQUFDLHNCQUFzQixHQUFHLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsWUFBWTtRQUM1RCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFFN0IsSUFBSSxDQUFDLHFCQUFxQixHQUFHLENBQUMsQ0FBQztRQUUvQixJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osT0FBTyxHQUFHLEVBQUUsQ0FBQztTQUNk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LElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQy9DLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25DLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUMsTUFBTSxFQUFFO29CQUNuQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUN6RCxNQUFNO2lCQUNQO2FBQ0Y7WUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7U0FDbkI7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxPQUFPLENBQUMsR0FBRztRQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBRztRQUNQLE9BQU8sQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7Q0FDRixDQUFDIiwiZmlsZSI6Im9ibml6L09ibml6Q29ubmVjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFdTQ29tbWFuZCA9IHJlcXVpcmUoJy4vbGlicy93c2NvbW1hbmQnKTtcbmNvbnN0IGVtaXR0ZXIgPSByZXF1aXJlKCdldmVudGVtaXR0ZXIzJyk7XG5cbmNvbnN0IGlzTm9kZSA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIE9ibml6Q29ubmVjdGlvbiB7XG4gIGNvbnN0cnVjdG9yKGlkLCBvcHRpb25zKSB7XG4gICAgdGhpcy5pc05vZGUgPSBpc05vZGU7XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMuc29ja2V0ID0gbnVsbDtcbiAgICB0aGlzLnNvY2tldF9sb2NhbCA9IG51bGw7XG4gICAgdGhpcy5kZWJ1Z3ByaW50ID0gZmFsc2U7XG4gICAgdGhpcy5kZWJ1Z3ByaW50QmluYXJ5ID0gZmFsc2U7XG4gICAgdGhpcy5kZWJ1Z3MgPSBbXTtcbiAgICB0aGlzLm9uQ29ubmVjdENhbGxlZCA9IGZhbHNlO1xuICAgIHRoaXMuaHcgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5maXJtd2FyZV92ZXIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jb25uZWN0aW9uU3RhdGUgPSAnY2xvc2VkJzsgLy8gY2xvc2VkL2Nvbm5lY3RpbmcvY29ubmVjdGVkL2Nsb3NpbmdcbiAgICB0aGlzLmJ1ZmZlcmRBbW91bmRXYXJuQnl0ZXMgPSAxMCAqIDEwMDAgKiAxMDAwOyAvLyAxME0gYnl0ZXNcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgZW1pdHRlcigpO1xuXG4gICAgdGhpcy5fY29ubmVjdGlvblJldHJ5Q291bnQgPSAwO1xuXG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIGJpbmFyeTogb3B0aW9ucy5iaW5hcnkgPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlLFxuICAgICAgbG9jYWxfY29ubmVjdDogb3B0aW9ucy5sb2NhbF9jb25uZWN0ID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZSxcbiAgICAgIGRlYnVnX2RvbV9pZDogb3B0aW9ucy5kZWJ1Z19kb21faWQgfHwgJ29ibml6LWRlYnVnJyxcbiAgICAgIGF1dG9fY29ubmVjdDogb3B0aW9ucy5hdXRvX2Nvbm5lY3QgPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlLFxuICAgICAgYWNjZXNzX3Rva2VuOiBvcHRpb25zLmFjY2Vzc190b2tlbiB8fCBudWxsLFxuICAgICAgb2JuaXpfc2VydmVyOiBvcHRpb25zLm9ibml6X3NlcnZlciB8fCAnd3NzOi8vb2JuaXouaW8nLFxuICAgICAgcmVzZXRfb2JuaXpfb25fd3NfZGlzY29ubmVjdGlvbjpcbiAgICAgICAgb3B0aW9ucy5yZXNldF9vYm5pel9vbl93c19kaXNjb25uZWN0aW9uID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZSxcbiAgICB9O1xuICAgIGlmICh0aGlzLm9wdGlvbnMuYmluYXJ5KSB7XG4gICAgICB0aGlzLndzY29tbWFuZCA9IHRoaXMuY29uc3RydWN0b3IuV1NDb21tYW5kO1xuICAgICAgbGV0IGNsYXNzZXMgPSB0aGlzLmNvbnN0cnVjdG9yLldTQ29tbWFuZC5Db21tYW5kQ2xhc3NlcztcbiAgICAgIHRoaXMud3Njb21tYW5kcyA9IFtdO1xuICAgICAgZm9yIChsZXQgY2xhc3NfbmFtZSBpbiBjbGFzc2VzKSB7XG4gICAgICAgIHRoaXMud3Njb21tYW5kcy5wdXNoKFxuICAgICAgICAgIG5ldyBjbGFzc2VzW2NsYXNzX25hbWVdKHtcbiAgICAgICAgICAgIGh3OiB7XG4gICAgICAgICAgICAgIGZpcm13YXJlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIG1vZGVsOiAnb2JuaXpfYm9hcmQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlbGVnYXRlOiB1bmRlZmluZWQsXG4gICAgICAgICAgfSlcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5hdXRvX2Nvbm5lY3QpIHtcbiAgICAgIHRoaXMud3Njb25uZWN0KCk7XG4gICAgfVxuICB9XG5cbiAgcHJvbXB0KGZpbGxlZCwgY2FsbGJhY2spIHtcbiAgICBsZXQgb2JuaXppZCA9IHByb21wdCgnUGxlYXNlIGVudGVyIG9ibml6IGlkJywgZmlsbGVkKTtcbiAgICBpZiAob2JuaXppZCkge1xuICAgICAgY2FsbGJhY2sob2JuaXppZCk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldCB2ZXJzaW9uKCkge1xuICAgIGxldCBwYWNrYWdlSnNvbiA9IHJlcXVpcmUoJy4uLy4uL3BhY2thZ2UuanNvbicpO1xuICAgIHJldHVybiBwYWNrYWdlSnNvbi52ZXJzaW9uO1xuICB9XG5cbiAgd3NPbk9wZW4oKSB7XG4gICAgdGhpcy5wcmludF9kZWJ1Zygnd3MgY29ubmVjdGVkJyk7XG4gICAgdGhpcy5fY29ubmVjdGlvblJldHJ5Q291bnQgPSAwO1xuICAgIC8vIHdhaXQgZm9yIHt3czp7cmVhZHk6dHJ1ZX19IG9iamVjdFxuICAgIGlmICh0eXBlb2YgdGhpcy5vbm9wZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMub25vcGVuKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIHdzT25NZXNzYWdlKGRhdGEpIHtcbiAgICBsZXQganNvbjtcbiAgICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgICBqc29uID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMud3Njb21tYW5kcykge1xuICAgICAgaWYgKHRoaXMuZGVidWdwcmludEJpbmFyeSkge1xuICAgICAgICBjb25zb2xlLmxvZygnT2JuaXo6IGJpbmFsaXplZDogJyArIG5ldyBVaW50OEFycmF5KGRhdGEpLnRvU3RyaW5nKCkpO1xuICAgICAgfVxuICAgICAganNvbiA9IHRoaXMuYmluYXJ5Mkpzb24oZGF0YSk7XG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoanNvbikpIHtcbiAgICAgIGZvciAobGV0IGkgaW4ganNvbikge1xuICAgICAgICB0aGlzLm5vdGlmeVRvTW9kdWxlKGpzb25baV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvL2ludmFsaWQganNvblxuICAgIH1cbiAgfVxuXG4gIHdzT25DbG9zZShldmVudCkge1xuICAgIHRoaXMucHJpbnRfZGVidWcoJ2Nsb3NlZCcpO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnY2xvc2VkJyk7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9uY2xvc2UgPT09ICdmdW5jdGlvbicgJiYgdGhpcy5vbkNvbm5lY3RDYWxsZWQgPT0gdHJ1ZSkge1xuICAgICAgdGhpcy5vbmNsb3NlKHRoaXMpO1xuICAgIH1cbiAgICB0aGlzLm9uQ29ubmVjdENhbGxlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5fcmVjb25uZWN0KCk7XG4gIH1cblxuICBjb25uZWN0V2FpdChvcHRpb24pIHtcbiAgICBvcHRpb24gPSBvcHRpb24gfHwge307XG4gICAgbGV0IHRpbWVvdXQgPSBvcHRpb24udGltZW91dCB8fCBudWxsO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICh0aGlzLm9uQ29ubmVjdENhbGxlZCkge1xuICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLmVtaXR0ZXIub25jZSgnY29ubmVjdGVkJywgKCkgPT4ge1xuICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgfSk7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5hdXRvX2Nvbm5lY3QpIHtcbiAgICAgICAgdGhpcy5lbWl0dGVyLm9uY2UoJ2Nsb3NlZCcsICgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBpZiAodGltZW91dCkge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgfSwgdGltZW91dCAqIDEwMDApO1xuICAgICAgfVxuICAgICAgdGhpcy5jb25uZWN0KCk7XG4gICAgfSk7XG4gIH1cblxuICBfcmVjb25uZWN0KCkge1xuICAgIHRoaXMuX2Nvbm5lY3Rpb25SZXRyeUNvdW50Kys7XG4gICAgbGV0IHRyeUFmdGVyID0gMTAwMDtcbiAgICBpZiAodGhpcy5fY29ubmVjdGlvblJldHJ5Q291bnQgPiAxNSkge1xuICAgICAgdHJ5QWZ0ZXIgPSAodGhpcy5fY29ubmVjdGlvblJldHJ5Q291bnQgLSAxNSkgKiAxMDAwO1xuICAgICAgY29uc3QgTGltaXQgPSBpc05vZGUgPyA2MCAqIDEwMDAgOiAxMCAqIDEwMDA7XG4gICAgICBpZiAodHJ5QWZ0ZXIgPiBMaW1pdCkge1xuICAgICAgICB0cnlBZnRlciA9IExpbWl0O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5vcHRpb25zLmF1dG9fY29ubmVjdCkge1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMud3Njb25uZWN0KCk7IC8vIGFsd2F5cyBjb25uZWN0IHRvIG1haW5zZXJ2ZXIgaWYgd3MgbG9zdFxuICAgICAgfSwgdHJ5QWZ0ZXIpO1xuICAgIH1cbiAgfVxuXG4gIHdzT25FcnJvcihldmVudCkge1xuICAgIC8vIGNvbnNvbGUuZXJyb3IoZXZlbnQpO1xuICB9XG5cbiAgd3NPblVuZXhwZWN0ZWRSZXNwb25zZShyZXEsIHJlcykge1xuICAgIGlmIChyZXMgJiYgcmVzLnN0YXR1c0NvZGUgPT0gNDA0KSB7XG4gICAgICB0aGlzLnByaW50X2RlYnVnKCdvYm5peiBub3Qgb25saW5lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJpbnRfZGVidWcoJ2ludmFsaWQgc2VydmVyIHJlc3BvbnNlICcgKyByZXMgPyByZXMuc3RhdHVzQ29kZSA6ICcnKTtcbiAgICB9XG5cbiAgICB0aGlzLmNsZWFyU29ja2V0KHRoaXMuc29ja2V0KTtcbiAgICBkZWxldGUgdGhpcy5zb2NrZXQ7XG5cbiAgICB0aGlzLl9yZWNvbm5lY3QoKTtcbiAgfVxuXG4gIHdzY29ubmVjdChkZXNpcmVkX3NlcnZlcikge1xuICAgIGxldCBzZXJ2ZXIgPSB0aGlzLm9wdGlvbnMub2JuaXpfc2VydmVyO1xuICAgIGlmIChkZXNpcmVkX3NlcnZlcikge1xuICAgICAgc2VydmVyID0gJycgKyBkZXNpcmVkX3NlcnZlcjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zb2NrZXQgJiYgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA8PSAxKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuXG4gICAgbGV0IHVybCA9IHNlcnZlciArICcvb2JuaXovJyArIHRoaXMuaWQgKyAnL3dzLzEnO1xuXG4gICAgbGV0IHF1ZXJ5ID0gW107XG4gICAgaWYgKHRoaXMuY29uc3RydWN0b3IudmVyc2lvbikge1xuICAgICAgcXVlcnkucHVzaCgnb2JuaXpqcz0nICsgdGhpcy5jb25zdHJ1Y3Rvci52ZXJzaW9uKTtcbiAgICB9XG4gICAgaWYgKHRoaXMub3B0aW9ucy5hY2Nlc3NfdG9rZW4pIHtcbiAgICAgIHF1ZXJ5LnB1c2goJ2FjY2Vzc190b2tlbj0nICsgdGhpcy5vcHRpb25zLmFjY2Vzc190b2tlbik7XG4gICAgfVxuICAgIGlmICh0aGlzLndzY29tbWFuZCkge1xuICAgICAgcXVlcnkucHVzaCgnYWNjZXB0X2JpbmFyeT10cnVlJyk7XG4gICAgfVxuICAgIGlmIChxdWVyeS5sZW5ndGggPiAwKSB7XG4gICAgICB1cmwgKz0gJz8nICsgcXVlcnkuam9pbignJicpO1xuICAgIH1cbiAgICB0aGlzLnByaW50X2RlYnVnKCdjb25uZWN0aW5nIHRvICcgKyB1cmwpO1xuXG4gICAgbGV0IHNvY2tldDtcbiAgICBpZiAodGhpcy5pc05vZGUpIHtcbiAgICAgIGNvbnN0IHdzQ2xpZW50ID0gcmVxdWlyZSgnd3MnKTtcbiAgICAgIHNvY2tldCA9IG5ldyB3c0NsaWVudCh1cmwpO1xuICAgICAgc29ja2V0Lm9uKCdvcGVuJywgdGhpcy53c09uT3Blbi5iaW5kKHRoaXMpKTtcbiAgICAgIHNvY2tldC5vbignbWVzc2FnZScsIHRoaXMud3NPbk1lc3NhZ2UuYmluZCh0aGlzKSk7XG4gICAgICBzb2NrZXQub24oJ2Nsb3NlJywgdGhpcy53c09uQ2xvc2UuYmluZCh0aGlzKSk7XG4gICAgICBzb2NrZXQub24oJ2Vycm9yJywgdGhpcy53c09uRXJyb3IuYmluZCh0aGlzKSk7XG4gICAgICBzb2NrZXQub24oJ3VuZXhwZWN0ZWQtcmVzcG9uc2UnLCB0aGlzLndzT25VbmV4cGVjdGVkUmVzcG9uc2UuYmluZCh0aGlzKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNvY2tldCA9IG5ldyBXZWJTb2NrZXQodXJsKTtcbiAgICAgIHNvY2tldC5iaW5hcnlUeXBlID0gJ2FycmF5YnVmZmVyJztcbiAgICAgIHNvY2tldC5vbm9wZW4gPSB0aGlzLndzT25PcGVuLmJpbmQodGhpcyk7XG4gICAgICBzb2NrZXQub25tZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdGhpcy53c09uTWVzc2FnZShldmVudC5kYXRhKTtcbiAgICAgIH0uYmluZCh0aGlzKTtcbiAgICAgIHNvY2tldC5vbmNsb3NlID0gdGhpcy53c09uQ2xvc2UuYmluZCh0aGlzKTtcbiAgICAgIHNvY2tldC5vbmVycm9yID0gdGhpcy53c09uRXJyb3IuYmluZCh0aGlzKTtcbiAgICB9XG4gICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG5cbiAgICB0aGlzLmNvbm5lY3Rpb25TdGF0ZSA9ICdjb25uZWN0aW5nJztcbiAgfVxuXG4gIF9jb25uZWN0TG9jYWwoaG9zdCkge1xuICAgIGNvbnN0IHVybCA9ICd3czovLycgKyBob3N0O1xuICAgIHRoaXMucHJpbnRfZGVidWcoJ2xvY2FsIGNvbm5lY3QgdG8gJyArIHVybCk7XG4gICAgbGV0IHdzO1xuICAgIGlmICh0aGlzLmlzTm9kZSkge1xuICAgICAgY29uc3Qgd3NDbGllbnQgPSByZXF1aXJlKCd3cycpO1xuXG4gICAgICB3cyA9IG5ldyB3c0NsaWVudCh1cmwpO1xuICAgICAgd3Mub24oJ29wZW4nLCAoKSA9PiB7XG4gICAgICAgIHRoaXMucHJpbnRfZGVidWcoJ2Nvbm5lY3RlZCB0byAnICsgdXJsKTtcbiAgICAgICAgdGhpcy5fY2FsbE9uQ29ubmVjdCgpO1xuICAgICAgfSk7XG4gICAgICB3cy5vbignbWVzc2FnZScsIGRhdGEgPT4ge1xuICAgICAgICB0aGlzLnByaW50X2RlYnVnKCdyZWN2ZCB2aWEgbG9jYWwnKTtcbiAgICAgICAgdGhpcy53c09uTWVzc2FnZShkYXRhKTtcbiAgICAgIH0pO1xuICAgICAgd3Mub24oJ2Nsb3NlJywgZXZlbnQgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnbG9jYWwgd2Vic29ja2V0IGNsb3NlZCcpO1xuICAgICAgICB0aGlzLl9kaXNjb25uZWN0TG9jYWwoKTtcbiAgICAgIH0pO1xuICAgICAgd3Mub24oJ2Vycm9yJywgZXJyID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcignbG9jYWwgd2Vic29ja2V0IGVycm9yLicsIGVycik7XG4gICAgICAgIHRoaXMuX2Rpc2Nvbm5lY3RMb2NhbCgpO1xuICAgICAgfSk7XG4gICAgICB3cy5vbigndW5leHBlY3RlZC1yZXNwb25zZScsIGV2ZW50ID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2xvY2FsIHdlYnNvY2tldCBjbG9zZWQnKTtcbiAgICAgICAgdGhpcy5fZGlzY29ubmVjdExvY2FsKCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgd3MgPSBuZXcgV2ViU29ja2V0KHVybCk7XG4gICAgICB3cy5iaW5hcnlUeXBlID0gJ2FycmF5YnVmZmVyJztcbiAgICAgIHdzLm9ub3BlbiA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5wcmludF9kZWJ1ZygnY29ubmVjdGVkIHRvICcgKyB1cmwpO1xuICAgICAgICB0aGlzLl9jYWxsT25Db25uZWN0KCk7XG4gICAgICB9O1xuICAgICAgd3Mub25tZXNzYWdlID0gZXZlbnQgPT4ge1xuICAgICAgICB0aGlzLnByaW50X2RlYnVnKCdyZWN2ZCB2aWEgbG9jYWwnKTtcbiAgICAgICAgdGhpcy53c09uTWVzc2FnZShldmVudC5kYXRhKTtcbiAgICAgIH07XG4gICAgICB3cy5vbmNsb3NlID0gZXZlbnQgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnbG9jYWwgd2Vic29ja2V0IGNsb3NlZCcpO1xuICAgICAgICB0aGlzLl9kaXNjb25uZWN0TG9jYWwoKTtcbiAgICAgIH07XG4gICAgICB3cy5vbmVycm9yID0gZXJyID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ2xvY2FsIHdlYnNvY2tldCBlcnJvci4nLCBlcnIpO1xuICAgICAgICB0aGlzLl9kaXNjb25uZWN0TG9jYWwoKTtcbiAgICAgIH07XG4gICAgfVxuICAgIHRoaXMuc29ja2V0X2xvY2FsID0gd3M7XG4gIH1cblxuICBfZGlzY29ubmVjdExvY2FsKCkge1xuICAgIGlmICh0aGlzLnNvY2tldF9sb2NhbCkge1xuICAgICAgaWYgKHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPD0gMSkge1xuICAgICAgICB0aGlzLnNvY2tldF9sb2NhbC5jbG9zZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5jbGVhclNvY2tldCh0aGlzLnNvY2tldF9sb2NhbCk7XG4gICAgICBkZWxldGUgdGhpcy5zb2NrZXRfbG9jYWw7XG4gICAgfVxuICAgIGlmICh0aGlzLl93YWl0Rm9yTG9jYWxDb25uZWN0UmVhZHlUaW1lcikge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3dhaXRGb3JMb2NhbENvbm5lY3RSZWFkeVRpbWVyKTtcbiAgICAgIHRoaXMuX3dhaXRGb3JMb2NhbENvbm5lY3RSZWFkeVRpbWVyID0gbnVsbDtcbiAgICAgIHRoaXMuX2NhbGxPbkNvbm5lY3QoKTsgLyogc2hvdWxkIGNhbGwuIG9ubHlsIGxvY2FsIGNvbm5lY3Qgd2FzIGxvc3QuIGFuZCB3YWl0aW5nLiAqL1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyU29ja2V0KHNvY2tldCkge1xuICAgIGlmICghc29ja2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8qIHNlbmQgcXVldWUgKi9cbiAgICBpZiAodGhpcy5fc2VuZFF1ZXVlVGltZXIpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9zZW5kUXVldWU7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5fc2VuZFF1ZXVlVGltZXIpO1xuICAgICAgdGhpcy5fc2VuZFF1ZXVlVGltZXIgPSBudWxsO1xuICAgIH1cbiAgICAvKiB1bmJpbmQgKi9cbiAgICBpZiAodGhpcy5pc05vZGUpIHtcbiAgICAgIGxldCBzaG91bGRSZW1vdmVPYnNlcnZlcnMgPSBbXG4gICAgICAgICdvcGVuJyxcbiAgICAgICAgJ21lc3NhZ2UnLFxuICAgICAgICAnY2xvc2UnLFxuICAgICAgICAnZXJyb3InLFxuICAgICAgICAndW5leHBlY3RlZC1yZXNwb25zZScsXG4gICAgICBdO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaG91bGRSZW1vdmVPYnNlcnZlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc29ja2V0LnJlbW92ZUFsbExpc3RlbmVycyhzaG91bGRSZW1vdmVPYnNlcnZlcnNbaV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzb2NrZXQub25vcGVuID0gbnVsbDtcbiAgICAgIHNvY2tldC5vbm1lc3NhZ2UgPSBudWxsO1xuICAgICAgc29ja2V0Lm9uY2xvc2UgPSBudWxsO1xuICAgICAgc29ja2V0Lm9uZXJyb3IgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGNvbm5lY3QoKSB7XG4gICAgaWYgKHRoaXMuc29ja2V0ICYmIHRoaXMuc29ja2V0LnJlYWR5U3RhdGUgPD0gMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLndzY29ubmVjdCgpO1xuICB9XG5cbiAgY2xvc2UoKSB7XG4gICAgdGhpcy5fZHJhaW5RdWV1ZWQoKTtcbiAgICB0aGlzLl9kaXNjb25uZWN0TG9jYWwoKTtcbiAgICBpZiAodGhpcy5zb2NrZXQpIHtcbiAgICAgIGlmICh0aGlzLnNvY2tldC5yZWFkeVN0YXRlIDw9IDEpIHtcbiAgICAgICAgLy8gQ29ubmVjdGluZyAmIENvbm5lY3RlZFxuICAgICAgICB0aGlzLmNvbm5lY3Rpb25TdGF0ZSA9ICdjbG9zaW5nJztcbiAgICAgICAgdGhpcy5zb2NrZXQuY2xvc2UoMTAwMCwgJ2Nsb3NlJyk7XG4gICAgICB9XG4gICAgICB0aGlzLmNsZWFyU29ja2V0KHRoaXMuc29ja2V0KTtcbiAgICAgIGRlbGV0ZSB0aGlzLnNvY2tldDtcbiAgICB9XG4gICAgdGhpcy5jb25uZWN0aW9uU3RhdGUgPSAnY2xvc2VkJztcbiAgfVxuXG4gIF9jYWxsT25Db25uZWN0KCkge1xuICAgIGxldCBjYW5DaGFuZ2VUb0Nvbm5lY3RlZCA9IHRydWU7XG4gICAgaWYgKHRoaXMuX3dhaXRGb3JMb2NhbENvbm5lY3RSZWFkeVRpbWVyKSB7XG4gICAgICAvKiBvYm5pei5qcyBjYW4ndCB3YWl0IGZvciBsb2NhbF9jb25uZWN0IGFueSBtb3JlISAqL1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3dhaXRGb3JMb2NhbENvbm5lY3RSZWFkeVRpbWVyKTtcbiAgICAgIHRoaXMuX3dhaXRGb3JMb2NhbENvbm5lY3RSZWFkeVRpbWVyID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgLyogb2JuaXouanMgaGFzIHRvIHdhaXQgZm9yIGxvY2FsX2Nvbm5lY3QgZXN0YWJsaXNoICovXG4gICAgICBpZiAodGhpcy5zb2NrZXRfbG9jYWwgJiYgdGhpcy5zb2NrZXRfbG9jYWwucmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgICAgICAvKiBkZWxheWVkIGNvbm5lY3QgKi9cbiAgICAgICAgY2FuQ2hhbmdlVG9Db25uZWN0ZWQgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8qIGxvY2FsX2Nvbm5lY3QgaXMgbm90IHVzZWQgKi9cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnY29ubmVjdGVkJyk7XG5cbiAgICBpZiAoY2FuQ2hhbmdlVG9Db25uZWN0ZWQpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvblN0YXRlID0gJ2Nvbm5lY3RlZCc7XG4gICAgICBpZiAodHlwZW9mIHRoaXMub25jb25uZWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IHByb21pc2UgPSB0aGlzLm9uY29ubmVjdCh0aGlzKTtcbiAgICAgICAgaWYgKHByb21pc2UgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgICAgcHJvbWlzZS5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLm9uQ29ubmVjdENhbGxlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcHJpbnRfZGVidWcoc3RyKSB7XG4gICAgaWYgKHRoaXMuZGVidWdwcmludCkge1xuICAgICAgY29uc29sZS5sb2coJ09ibml6OiAnICsgc3RyKTtcbiAgICB9XG4gIH1cblxuICBzZW5kKG9iaiwgb3B0aW9ucykge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBjb25zb2xlLmxvZygnb2JuaXpqcy4gZGlkbnQgc2VuZCAnLCBvYmopO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2JqLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5zZW5kKG9ialtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc2VuZFBvb2wpIHtcbiAgICAgICAgdGhpcy5zZW5kUG9vbC5wdXNoKG9iaik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IHNlbmREYXRhID0gSlNPTi5zdHJpbmdpZnkoW29ial0pO1xuICAgICAgaWYgKHRoaXMuZGVidWdwcmludCkge1xuICAgICAgICB0aGlzLnByaW50X2RlYnVnKCdzZW5kOiAnICsgc2VuZERhdGEpO1xuICAgICAgfVxuXG4gICAgICAvKiBjb21wcmVzcyAqL1xuICAgICAgaWYgKFxuICAgICAgICB0aGlzLndzY29tbWFuZCAmJlxuICAgICAgICAodHlwZW9mIG9wdGlvbnMgIT09ICdvYmplY3QnIHx8IG9wdGlvbnMubG9jYWxfY29ubmVjdCAhPT0gZmFsc2UpXG4gICAgICApIHtcbiAgICAgICAgbGV0IGNvbXByZXNzZWQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29tcHJlc3NlZCA9IHRoaXMud3Njb21tYW5kLmNvbXByZXNzKFxuICAgICAgICAgICAgdGhpcy53c2NvbW1hbmRzLFxuICAgICAgICAgICAgSlNPTi5wYXJzZShzZW5kRGF0YSlbMF1cbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChjb21wcmVzc2VkKSB7XG4gICAgICAgICAgICBzZW5kRGF0YSA9IGNvbXByZXNzZWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5kZWJ1Z3ByaW50QmluYXJ5KSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICdPYm5pejogYmluYWxpemVkOiAnICsgbmV3IFVpbnQ4QXJyYXkoY29tcHJlc3NlZCkudG9TdHJpbmcoKVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHRoaXMuZXJyb3IoJy0tLS0tLSBlcnJvcmVkIGpzb24gLS0tLS0tLScpO1xuICAgICAgICAgIHRoaXMuZXJyb3Ioc2VuZERhdGEpO1xuICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLyogcXVldWUgc2VuZGluZyAqL1xuICAgICAgaWYgKHR5cGVvZiBzZW5kRGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fZHJhaW5RdWV1ZWQoKTtcbiAgICAgICAgdGhpcy5fc2VuZFJvdXRlZChzZW5kRGF0YSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5fc2VuZFF1ZXVlKSB7XG4gICAgICAgICAgdGhpcy5fc2VuZFF1ZXVlLnB1c2goc2VuZERhdGEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuX3NlbmRRdWV1ZSA9IFtzZW5kRGF0YV07XG4gICAgICAgICAgdGhpcy5fc2VuZFF1ZXVlVGltZXIgPSBzZXRUaW1lb3V0KHRoaXMuX2RyYWluUXVldWVkLmJpbmQodGhpcyksIDApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgfVxuICB9XG5cbiAgX3NlbmRSb3V0ZWQoZGF0YSkge1xuICAgIGlmIChcbiAgICAgIHRoaXMuc29ja2V0X2xvY2FsICYmXG4gICAgICB0aGlzLnNvY2tldF9sb2NhbC5yZWFkeVN0YXRlID09PSAxICYmXG4gICAgICB0eXBlb2YgZGF0YSAhPT0gJ3N0cmluZydcbiAgICApIHtcbiAgICAgIHRoaXMucHJpbnRfZGVidWcoJ3NlbmQgdmlhIGxvY2FsJyk7XG4gICAgICB0aGlzLnNvY2tldF9sb2NhbC5zZW5kKGRhdGEpO1xuICAgICAgaWYgKHRoaXMuc29ja2V0X2xvY2FsLmJ1ZmZlcmVkQW1vdW50ID4gdGhpcy5idWZmZXJkQW1vdW5kV2FybkJ5dGVzKSB7XG4gICAgICAgIHRoaXMud2FybmluZyhcbiAgICAgICAgICAnb3ZlciAnICsgdGhpcy5zb2NrZXRfbG9jYWwuYnVmZmVyZWRBbW91bnQgKyAnIGJ5dGVzIHF1ZXVlZCdcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zb2NrZXQgJiYgdGhpcy5zb2NrZXQucmVhZHlTdGF0ZSA9PT0gMSkge1xuICAgICAgdGhpcy5zb2NrZXQuc2VuZChkYXRhKTtcbiAgICAgIGlmICh0aGlzLnNvY2tldC5idWZmZXJlZEFtb3VudCA+IHRoaXMuYnVmZmVyZEFtb3VuZFdhcm5CeXRlcykge1xuICAgICAgICB0aGlzLndhcm5pbmcoJ292ZXIgJyArIHRoaXMuc29ja2V0LmJ1ZmZlcmVkQW1vdW50ICsgJyBieXRlcyBxdWV1ZWQnKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBfZHJhaW5RdWV1ZWQoKSB7XG4gICAgaWYgKCF0aGlzLl9zZW5kUXVldWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGV4cGVjdFNpemUgPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc2VuZFF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBleHBlY3RTaXplICs9IHRoaXMuX3NlbmRRdWV1ZVtpXS5sZW5ndGg7XG4gICAgfVxuICAgIGxldCBmaWxsZWQgPSAwO1xuICAgIGxldCBzZW5kRGF0YSA9IG5ldyBVaW50OEFycmF5KGV4cGVjdFNpemUpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc2VuZFF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBzZW5kRGF0YS5zZXQodGhpcy5fc2VuZFF1ZXVlW2ldLCBmaWxsZWQpO1xuICAgICAgZmlsbGVkICs9IHRoaXMuX3NlbmRRdWV1ZVtpXS5sZW5ndGg7XG4gICAgfVxuICAgIHRoaXMuX3NlbmRSb3V0ZWQoc2VuZERhdGEpO1xuICAgIGRlbGV0ZSB0aGlzLl9zZW5kUXVldWU7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuX3NlbmRRdWV1ZVRpbWVyKTtcbiAgICB0aGlzLl9zZW5kUXVldWVUaW1lciA9IG51bGw7XG4gIH1cblxuICBub3RpZnlUb01vZHVsZShvYmopIHtcbiAgICBpZiAodGhpcy5kZWJ1Z3ByaW50KSB7XG4gICAgICB0aGlzLnByaW50X2RlYnVnKEpTT04uc3RyaW5naWZ5KG9iaikpO1xuICAgIH1cblxuICAgIGlmIChvYmoud3MpIHtcbiAgICAgIHRoaXMuaGFuZGxlV1NDb21tYW5kKG9iai53cyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChvYmouc3lzdGVtKSB7XG4gICAgICB0aGlzLmhhbmRsZVN5c3RlbUNvbW1hbmQob2JqLnN5c3RlbSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgX2NhbkNvbm5lY3RUb0luc2VjdXJlKCkge1xuICAgIGlmICh0aGlzLmlzTm9kZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBsb2NhdGlvbi5wcm90b2NvbCAhPSAnaHR0cHM6JztcbiAgICB9XG4gIH1cblxuICBoYW5kbGVXU0NvbW1hbmQod3NPYmopIHtcbiAgICBpZiAod3NPYmoucmVhZHkpIHtcbiAgICAgIHRoaXMuZmlybXdhcmVfdmVyID0gd3NPYmoub2JuaXouZmlybXdhcmU7XG4gICAgICB0aGlzLmh3ID0gd3NPYmoub2JuaXouaHc7XG4gICAgICBpZiAoIXRoaXMuaHcpIHtcbiAgICAgICAgdGhpcy5odyA9ICdvYm5pemIxJztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLndzY29tbWFuZHMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndzY29tbWFuZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBjb21tYW5kID0gdGhpcy53c2NvbW1hbmRzW2ldO1xuICAgICAgICAgIGNvbW1hbmQuc2V0SHcoe1xuICAgICAgICAgICAgaHc6IHRoaXMuaHcsIC8vIGhhcmQgY29kaW5nXG4gICAgICAgICAgICBmaXJtd2FyZTogdGhpcy5maXJtd2FyZV92ZXIsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucmVzZXRfb2JuaXpfb25fd3NfZGlzY29ubmVjdGlvbikge1xuICAgICAgICB0aGlzLnJlc2V0T25EaXNjb25uZWN0KHRydWUpO1xuICAgICAgfVxuICAgICAgaWYgKFxuICAgICAgICB3c09iai5sb2NhbF9jb25uZWN0ICYmXG4gICAgICAgIHdzT2JqLmxvY2FsX2Nvbm5lY3QuaXAgJiZcbiAgICAgICAgdGhpcy53c2NvbW1hbmQgJiZcbiAgICAgICAgdGhpcy5vcHRpb25zLmxvY2FsX2Nvbm5lY3QgJiZcbiAgICAgICAgdGhpcy5fY2FuQ29ubmVjdFRvSW5zZWN1cmUoKVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3RMb2NhbCh3c09iai5sb2NhbF9jb25uZWN0LmlwKTtcbiAgICAgICAgdGhpcy5fd2FpdEZvckxvY2FsQ29ubmVjdFJlYWR5VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICB0aGlzLl9jYWxsT25Db25uZWN0KCk7XG4gICAgICAgIH0sIDMwMDApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY2FsbE9uQ29ubmVjdCgpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAod3NPYmoucmVkaXJlY3QpIHtcbiAgICAgIGxldCBzZXJ2ZXIgPSB3c09iai5yZWRpcmVjdDtcbiAgICAgIHRoaXMucHJpbnRfZGVidWcoJ1dTIGNvbm5lY3Rpb24gY2hhbmdlZCB0byAnICsgc2VydmVyKTtcblxuICAgICAgLyogY2xvc2UgY3VycmVudCB3cyBpbW1pZGlhdGVseSAqL1xuICAgICAgLyogICovXG4gICAgICB0aGlzLnNvY2tldC5jbG9zZSgxMDAwLCAnY2xvc2UnKTtcbiAgICAgIHRoaXMuY2xlYXJTb2NrZXQodGhpcy5zb2NrZXQpO1xuICAgICAgZGVsZXRlIHRoaXMuc29ja2V0O1xuXG4gICAgICAvKiBjb25uZWN0IHRvIG5ldyBzZXJ2ZXIgKi9cbiAgICAgIHRoaXMud3Njb25uZWN0KHNlcnZlcik7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlU3lzdGVtQ29tbWFuZCh3c09iaikge31cblxuICBzdGF0aWMgZ2V0IFdTQ29tbWFuZCgpIHtcbiAgICByZXR1cm4gV1NDb21tYW5kO1xuICB9XG5cbiAgYmluYXJ5Mkpzb24oYmluYXJ5KSB7XG4gICAgbGV0IGRhdGEgPSBuZXcgVWludDhBcnJheShiaW5hcnkpO1xuICAgIGxldCBqc29uID0gW107XG4gICAgd2hpbGUgKGRhdGEgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGZyYW1lID0gV1NDb21tYW5kLmRlcXVldWVPbmUoZGF0YSk7XG4gICAgICBpZiAoIWZyYW1lKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgbGV0IG9iaiA9IHt9O1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLndzY29tbWFuZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IHRoaXMud3Njb21tYW5kc1tpXTtcbiAgICAgICAgaWYgKGNvbW1hbmQubW9kdWxlID09PSBmcmFtZS5tb2R1bGUpIHtcbiAgICAgICAgICBjb21tYW5kLm5vdGlmeUZyb21CaW5hcnkob2JqLCBmcmFtZS5mdW5jLCBmcmFtZS5wYXlsb2FkKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAganNvbi5wdXNoKG9iaik7XG4gICAgICBkYXRhID0gZnJhbWUubmV4dDtcbiAgICB9XG4gICAgcmV0dXJuIGpzb247XG4gIH1cblxuICB3YXJuaW5nKG1zZykge1xuICAgIGNvbnNvbGUubG9nKCd3YXJuaW5nOicgKyBtc2cpO1xuICB9XG5cbiAgZXJyb3IobXNnKSB7XG4gICAgY29uc29sZS5lcnJvcignZXJyb3I6JyArIG1zZyk7XG4gIH1cbn07XG4iXX0=
