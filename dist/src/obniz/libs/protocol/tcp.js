"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isNode = typeof window === "undefined";
const semver = require("semver");
class Tcp {
    constructor(obniz, id) {
        this.Obniz = obniz;
        this.id = id;
        this._reset();
    }
    _reset() {
        this.connectObservers = [];
        this.readObservers = [];
        this.used = false;
    }
    _addConnectObserver(callback) {
        if (callback) {
            this.connectObservers.push(callback);
        }
    }
    _addReadObserver(callback) {
        if (callback) {
            this.readObservers.push(callback);
        }
    }
    connectWait(port, domain) {
        if (semver.lt(this.Obniz.firmware_ver, "2.1.0")) {
            throw new Error(`Please update obniz firmware >= 2.1.0`);
        }
        // TODO
        // if (this.used) {
        //   throw new Error(`tcp${this.id} is in used`);
        // }
        if (port < 0 || port > 65535) {
            throw new Error(`tcp${this.id} is invalid port`);
        }
        if (domain.length > 30) {
            throw new Error(`tcp${this.id} is domain length over`);
        }
        this.connectObservers = [];
        this.used = true;
        return new Promise((resolve, reject) => {
            this._addConnectObserver(resolve);
            const obj = {};
            obj["tcp" + this.id] = {
                connect: {
                    port,
                    domain,
                },
            };
            this.Obniz.send(obj);
        });
    }
    close() {
        if (!this.used) {
            throw new Error(`tcp${this.id} is not used`);
        }
        const obj = {};
        obj["tcp" + this.id] = {
            disconnect: true,
        };
        this.Obniz.send(obj);
    }
    write(data) {
        if (!this.used) {
            throw new Error(`tcp${this.id} is not started`);
        }
        if (data === undefined) {
            return;
        }
        if (typeof data === "number") {
            data = [data];
        }
        let send_data = null;
        if (isNode && data instanceof Buffer) {
            send_data = [...data];
        }
        else if (data.constructor === Array) {
            send_data = data;
        }
        else if (typeof data === "string") {
            const buf = Buffer.from(data);
            send_data = [...buf];
        }
        const obj = {};
        obj["tcp" + this.id] = {
            write: {
                data: send_data,
            },
        };
        this.Obniz.send(obj);
    }
    readWait() {
        if (!this.used) {
            throw new Error(`tcp${this.id} is not started`);
        }
        return new Promise((resolve, reject) => {
            this._addReadObserver(resolve);
        });
    }
    end() {
        this.close();
    }
    notified(obj) {
        if (obj.connection) {
            /* Connectino state update. response of connect(), close from destination, response from */
            if (this.onconnection) {
                this.onconnection(obj.connection.connected);
            }
            if (!obj.connection.connected) {
                this._reset();
            }
        }
        else if (obj.read) {
            if (this.onreceive) {
                this.onreceive(obj.read.data);
            }
            const callback = this.readObservers.shift();
            if (callback) {
                callback(obj.read.data);
            }
        }
        else if (obj.connect) {
            /* response of connect() */
            /* `this.connection` will called before this function */
            if (obj.connect.code !== 0) {
                if (this.onerror) {
                    this.onerror(obj.connect);
                }
            }
            const callback = this.connectObservers.shift();
            if (callback) {
                callback(obj.connect.code);
            }
        }
    }
    isUsed() {
        return this.used;
    }
}
exports.default = Tcp;

//# sourceMappingURL=tcp.js.map
