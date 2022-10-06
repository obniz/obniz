"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WiFi = void 0;
const semver_1 = __importDefault(require("semver"));
class WiFi {
    constructor(obniz, id) {
        this.Obniz = obniz;
        this._reset();
    }
    /**
     * Scan WiFi
     *
     * ```javascript
     * // Javascript Example
     * console.log(await obniz.wifi.scanWait());
     * ```
     *
     */
    scanWait() {
        if (semver_1.default.lt(this.Obniz.firmware_ver, '3.3.0')) {
            throw new Error(`Please update obniz firmware >= 3.3.0`);
        }
        this.connectObservers = [];
        return new Promise((resolve, reject) => {
            this._addConnectObserver(resolve);
            this.Obniz.send({ wifi: { scan: true } });
        });
    }
    /**
     *
     * ```javascript
     * // Javascript Example
     * obniz.wifi.end();
     * ```
     */
    end() {
        this._reset();
    }
    /**
     * @ignore
     * @param obj
     */
    notified(obj) {
        if (obj.scan) {
            /* Connectino state update. response of connect(), close from destination, response from */
            const callback = this.connectObservers.shift();
            if (callback) {
                callback(obj.scan);
            }
        }
    }
    _reset() {
        this.connectObservers = [];
    }
    _addConnectObserver(callback) {
        if (callback) {
            this.connectObservers.push(callback);
        }
    }
}
exports.WiFi = WiFi;
