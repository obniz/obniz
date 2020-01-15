"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ObnizSwitch {
    constructor(Obniz) {
        this.Obniz = Obniz;
        this._reset();
    }
    _reset() {
        this.observers = [];
        this.onChangeForStateWait = () => {
        };
    }
    addObserver(callback) {
        if (callback) {
            this.observers.push(callback);
        }
    }
    getWait() {
        const self = this;
        return new Promise((resolve, reject) => {
            const obj = {};
            obj.switch = "get";
            self.Obniz.send(obj);
            self.addObserver(resolve);
        });
    }
    stateWait(isPressed) {
        const self = this;
        return new Promise((resolve, reject) => {
            self.onChangeForStateWait = (pressed) => {
                if (isPressed === pressed) {
                    self.onChangeForStateWait = () => {
                    };
                    resolve();
                }
            };
        });
    }
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
}
exports.default = ObnizSwitch;
//# sourceMappingURL=switch.js.map