"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PeripheralAD {
    constructor(obniz, id) {
        this.Obniz = obniz;
        this.id = id;
        this._reset();
    }
    _reset() {
        this.value = 0.0;
        this.observers = [];
    }
    addObserver(callback) {
        if (callback) {
            this.observers.push(callback);
        }
    }
    start(callback) {
        this.onchange = callback;
        const obj = {};
        obj["ad" + this.id] = {
            stream: true,
        };
        this.Obniz.send(obj);
        return this.value;
    }
    getWait() {
        const self = this;
        return new Promise((resolve, reject) => {
            self.addObserver(resolve);
            const obj = {};
            obj["ad" + self.id] = {
                stream: false,
            };
            self.Obniz.send(obj);
        });
    }
    end() {
        this.onchange = undefined;
        const obj = {};
        obj["ad" + this.id] = null;
        this.Obniz.send(obj);
        return;
    }
    notified(obj) {
        this.value = obj;
        if (this.onchange) {
            this.onchange(obj);
        }
        const callback = this.observers.shift();
        if (callback) {
            callback(obj);
        }
    }
}
exports.default = PeripheralAD;
//# sourceMappingURL=ad.js.map