"use strict";
/**
 * @packageDocumentation
 * @module ObnizApp
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ObnizApp {
    /**
     * Determine obniz.js is running on obniz Cloud or not.
     */
    static isCloudRunning() {
        return typeof done === "function";
    }
    /**
     * request object on obniz Cloud execution for webhook call.
     *
     * ```javascript
     * // JavaScript example
     * const req = Obniz.App.req();
     * ```
     *
     */
    static req() {
        if (this.isCloudRunning()) {
            return req;
        }
        return {};
    }
    /**
     * done call for obniz Cloud execution.
     * Pass arguemnt for update cloud execution status.
     *
     * ```javascript
     * // JavaScript example
     * Obniz.App.done({
     *   status: 'success',  // or 'error'
     *   text: 'ex. Door Opened'
     * });
     * ```
     *
     */
    static done(arg) {
        if (this.isCloudRunning()) {
            return done(arg);
        }
        else {
            console.error(`This program is not running on obniz Cloud.`);
        }
    }
}
exports.default = ObnizApp;

//# sourceMappingURL=ObnizApp.js.map
