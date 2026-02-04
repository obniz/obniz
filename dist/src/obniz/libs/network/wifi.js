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
const ComponentAbstact_1 = require("../ComponentAbstact");
class WiFi extends ComponentAbstact_1.ComponentAbstract {
    constructor(obniz, id) {
        super(obniz);
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
    async scanWait() {
        if (semver_1.default.lt(this.Obniz.firmware_ver, '3.3.0')) {
            throw new Error(`Please update obniz firmware >= 3.3.0`);
        }
        const obj = { wifi: { scan: true } };
        const json = await this.sendAndReceiveJsonWait(obj, '/response/wifi/scan');
        return json.scan;
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
    schemaBasePath() {
        return 'wifi';
    }
    _reset() {
        // no-op
    }
}
exports.WiFi = WiFi;
