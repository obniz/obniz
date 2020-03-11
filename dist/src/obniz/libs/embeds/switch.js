"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The embedded switch on obniz Board.
 * @category Embeds
 */
class ObnizSwitch {
    constructor(Obniz, info) {
        this.Obniz = Obniz;
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
    getWait() {
        const self = this;
        return new Promise((resolve, reject) => {
            const obj = {};
            obj.switch = "get";
            self.Obniz.send(obj);
            self.addObserver(resolve);
        });
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
    stateWait(state) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.onChangeForStateWait = (pressed) => {
                if (state === pressed) {
                    self.onChangeForStateWait = () => { };
                    resolve();
                }
            };
        });
    }
    /**
     * @ignore
     * @param obj
     */
    notified(obj) {
        this.state = obj.state;
        if (this.onchange) {
            this.onchange(this.state);
        }
        this.onChangeForStateWait(this.state);
        const callback = this.observers.shift();
        if (callback) {
            callback(this.state);
        }
    }
    _reset() {
        this.state = "none";
        this.observers = [];
        this.onChangeForStateWait = () => { };
    }
    addObserver(callback) {
        if (callback) {
            this.observers.push(callback);
        }
    }
}
exports.default = ObnizSwitch;
//# sourceMappingURL=switch.js.map