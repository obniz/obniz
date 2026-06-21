"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugin = void 0;
const semver_1 = __importDefault(require("semver"));
const util_1 = require("../utils/util");
class Plugin {
    constructor(obniz, id) {
        this._callTransactionId = 0;
        this._pendingCalls = {};
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
    send(data) {
        if (semver_1.default.lt(this.Obniz.firmware_ver, '3.4.0')) {
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
        }
        else if (data.constructor === Array) {
            send_data = data;
        }
        else if (typeof data === 'string') {
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
    execLua(lua_script) {
        if (semver_1.default.major(this.Obniz.firmware_ver) < 7) {
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
    callWait(lua_script, timeout = 30 * 1000) {
        // Require firmware 7.1 or later. Compare by major/minor so prereleases
        // (e.g. 7.1.0-beta.0) are also accepted.
        const major = semver_1.default.major(this.Obniz.firmware_ver);
        const minor = semver_1.default.minor(this.Obniz.firmware_ver);
        if (major < 7 || (major === 7 && minor < 1)) {
            throw new Error(`Please update obniz firmware >= 7.1.0`);
        }
        if (typeof lua_script !== 'string') {
            throw new Error(`Lua Script must be a string`);
        }
        const id = this._getNextTransactionId();
        return new Promise((resolve, reject) => {
            let timer = null;
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
    reloadLua() {
        if (semver_1.default.major(this.Obniz.firmware_ver) < 7) {
            throw new Error(`Please update obniz firmware >= 7.0.0`);
        }
        this.Obniz.send({ plugin: { reload: true } });
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        // Reject all in-flight callWait() promises since the connection was reset.
        for (const id of Object.keys(this._pendingCalls)) {
            const pending = this._pendingCalls[id];
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
    notified(obj) {
        if (obj.receive) {
            /* Connectino state update. response of connect(), close from destination, response from */
            const string = util_1.ObnizUtil.dataArray2string(obj.receive);
            this.Obniz._runUserCreatedFunction(this.onreceive, obj.receive, string);
        }
        else if (obj.frame) {
            if (obj.frame.start) {
                const id = obj.frame.start.id;
                const length = obj.frame.start.length;
                this.Obniz._runUserCreatedFunction(this.onFrameStart, id, length);
            }
            else if (obj.frame.end) {
                this.Obniz._runUserCreatedFunction(this.onFrameEnd);
            }
        }
        else if (obj.error) {
            this.Obniz._runUserCreatedFunction(this.onError, obj.error);
        }
        else if (obj.call_response) {
            this._onCallResponse(obj.call_response);
        }
        else if (obj.cloud_transaction_request) {
            this._handleCloudTransactionWait(obj.cloud_transaction_request);
        }
    }
    _getNextTransactionId() {
        this._callTransactionId = (this._callTransactionId + 1) >>> 0;
        if (this._callTransactionId === 0) {
            this._callTransactionId = 1;
        }
        return this._callTransactionId;
    }
    _onCallResponse(res) {
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
        }
        else {
            pending.reject(new Error(res.result || `Lua error`));
        }
    }
    async _handleCloudTransactionWait(req) {
        const string = util_1.ObnizUtil.dataArray2string(req.data) || '';
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
        }
        catch (e) {
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
    _transactionResultToString(ret) {
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
exports.Plugin = Plugin;
