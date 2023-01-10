"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObnizSwitch = void 0;
const ComponentAbstact_1 = require("../ComponentAbstact");
/**
 * The embedded switch on obniz Board.
 *
 * @category Embeds
 */
class ObnizSwitch extends ComponentAbstact_1.ComponentAbstract {
    constructor(obniz, info) {
        super(obniz);
        this.on('/response/switch/change', (obj) => {
            this.state = obj.state;
            this.Obniz._runUserCreatedFunction(this.onchange, this.state);
        });
        this._reset();
    }
    /**
     * This determines the current status of the switch.
     *
     * ```javascript
     * // Javascript Example
     * obniz.display.clear();
     * var state = await obniz.switch.getWait();
     * if (state === "push") {
     *   obniz.display.print("Now Pressed");
     * }
     * ```
     *
     */
    async getWait() {
        const obj = {};
        obj.switch = 'get';
        const data = await this.sendAndReceiveJsonWait(obj, '/response/switch/change');
        return data.state;
    }
    /**
     * With this you wait until the switch status changes to state.
     *
     * ```javascript
     * // Javascript Example
     * await obniz.switch.stateWait("push");
     * console.log("switch pushed");
     *
     * await obniz.switch.stateWait("left");
     * console.log("switch left");
     *
     * await obniz.switch.stateWait("right");
     * console.log("switch right");
     *
     * await obniz.switch.stateWait("none");
     * console.log("switch none");
     * ```
     *
     * @param state state for wait
     */
    async stateWait(state) {
        while (1) {
            const data = await this.receiveJsonWait('/response/switch/change');
            if (state === data.state) {
                return;
            }
        }
    }
    schemaBasePath() {
        return 'switch';
    }
    _reset() {
        this.state = 'none';
    }
}
exports.ObnizSwitch = ObnizSwitch;
