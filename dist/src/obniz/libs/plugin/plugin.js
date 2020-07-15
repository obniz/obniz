"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = __importDefault(require("semver"));
class Plugin {
    constructor(obniz, id) {
        this.Obniz = obniz;
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
    send(data) {
        if (semver_1.default.lt(this.Obniz.firmware_ver, "3.4.0")) {
            throw new Error(`Please update obniz firmware >= 3.4.0`);
        }
        let send_data = null;
        if (data === undefined) {
            return;
        }
        if (typeof data === "number") {
            data = [data];
        }
        if (this.Obniz.isNode && data instanceof Buffer) {
            send_data = [...data];
        }
        else if (data.constructor === Array) {
            send_data = data;
        }
        else if (typeof data === "string") {
            const buf = Buffer.from(data);
            send_data = [...buf];
        }
        this.Obniz.send({ plugin: { send: send_data } });
    }
    /**
     * @ignore
     * @private
     */
    _reset() { }
    /**
     * @ignore
     * @param obj
     */
    notified(obj) {
        if (obj.receive) {
            /* Connectino state update. response of connect(), close from destination, response from */
            if (this.onreceive) {
                this.onreceive(obj.receive);
            }
        }
    }
}
exports.default = Plugin;

//# sourceMappingURL=plugin.js.map
