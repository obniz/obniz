"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tcp = void 0;
const semver_1 = __importDefault(require("semver"));
const ComponentAbstact_1 = require("../ComponentAbstact");
/**
 * Create a TCP connection from a device throught the network the device is currently connected to.
 *
 * @category Protocol
 */
class Tcp extends ComponentAbstact_1.ComponentAbstract {
    constructor(obniz, id) {
        super(obniz);
        this.id = id;
        this.on('/response/tcp/connection', (obj) => {
            /* Connectino state update. response of connect(), close from destination, response from */
            this.Obniz._runUserCreatedFunction(this.onconnection, obj.connection.connected);
            if (!obj.connection.connected) {
                this._reset();
            }
        });
        this.on('/response/tcp/read', (obj) => {
            this.Obniz._runUserCreatedFunction(this.onreceive, obj.read.data);
            const callback = this.readObservers.shift();
            if (callback) {
                callback(obj.read.data);
            }
        });
        this.on('/response/tcp/connect', (obj) => {
            /* response of connect() */
            /* `this.connection` will called before this function */
            if (obj.connect.code !== 0) {
                this.Obniz._runUserCreatedFunction(this.onerror, obj.connect);
            }
            const callback = this.connectObservers.shift();
            if (callback) {
                callback(obj.connect.code);
            }
        });
        this._reset();
    }
    /**
     * Starts a connection on the port and domain for which TCP is specified.
     *
     * ```javascript
     * // Javascript Example
     * var tcp = obniz.getFreeTcp();
     * tcp.connectWait(80,"obniz.io");
     * ```
     *
     * @param port
     * @param domain
     */
    connectWait(port, domain) {
        if (semver_1.default.lt(this.Obniz.firmware_ver, '2.1.0')) {
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
            obj['tcp' + this.id] = {
                connect: {
                    port,
                    domain,
                },
            };
            this.Obniz.send(obj);
        });
    }
    /**
     * The argument data is sent by TCP.
     *
     * If you pass a string or Array type argument, the data will be sent.
     *
     * ```javascript
     * // Javascript Example
     * var tcp = obniz.getFreeTcp();
     * tcp.connectWait(80,"obniz.io");
     *
     * // Array
     * tcp.write([0,1,2,3,4]);
     *
     * // Text
     * tcp.write('hello');
     * ```
     *
     * @param data
     */
    write(data) {
        if (!this.used) {
            throw new Error(`tcp${this.id} is not started`);
        }
        if (data === undefined) {
            return;
        }
        if (typeof data === 'number') {
            data = [data];
        }
        let send_data = null;
        if (this.Obniz.isNode && data instanceof Buffer) {
            send_data = [...data];
        }
        else if (data.constructor === Array) {
            send_data = data;
        }
        else if (typeof data === 'string') {
            const buf = Buffer.from(data);
            send_data = [...buf];
        }
        const obj = {};
        obj['tcp' + this.id] = {
            write: {
                data: send_data,
            },
        };
        this.Obniz.send(obj);
    }
    /**
     * Wait for TCP reception.
     *
     * ```javascript
     * // Javascript Example
     * var tcp = obniz.getFreeTcp();
     * tcp.connectWait(80,"obniz.io");
     *
     * let data = await tcp.readWait();
     * console.log(data);
     * ```
     */
    readWait() {
        if (!this.used) {
            throw new Error(`tcp${this.id} is not started`);
        }
        return new Promise((resolve, reject) => {
            this._addReadObserver(resolve);
        });
    }
    /**
     * Terminates the TCP session.
     *
     * ```javascript
     * // Javascript Example
     * var tcp = obniz.getFreeTcp();
     * tcp.end();
     * ```
     */
    end() {
        this.close();
    }
    /**
     * @ignore
     */
    isUsed() {
        return this.used;
    }
    schemaBasePath() {
        return 'tcp' + this.id;
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        this.connectObservers = [];
        this.readObservers = [];
        this.used = false;
    }
    close() {
        if (!this.used) {
            throw new Error(`tcp${this.id} is not used`);
        }
        const obj = {};
        obj['tcp' + this.id] = {
            disconnect: true,
        };
        this.Obniz.send(obj);
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
}
exports.Tcp = Tcp;
