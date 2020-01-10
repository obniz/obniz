"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const semver = require("semver");
class Directive {
    constructor(Obniz, id) {
        this.Obniz = Obniz;
        this.observers = [];
        this._reset();
    }
    _reset() {
        for (let i = 0; i < this.observers.length; i++) {
            this.observers[i].reject(new Error("reset called"));
        }
        this.observers = [];
        this._animationIdentifier = 0;
    }
    addObserver(name, resolve, reject) {
        if (name && resolve && reject) {
            this.observers.push({
                name,
                resolve,
                reject,
            });
        }
    }
    animation(name, status, array, repeat) {
        if ((typeof repeat === "number" || status === "registrate") &&
            semver.lt(this.Obniz.firmware_ver, "2.0.0")) {
            throw new Error(`Please update obniz firmware >= 2.0.0`);
        }
        const obj = {};
        obj.io = {
            animation: {
                name,
                status,
            },
        };
        if (typeof repeat === "number") {
            obj.io.animation.repeat = repeat;
        }
        if (!array) {
            array = [];
        }
        const states = [];
        for (let i = 0; i < array.length; i++) {
            const state = array[i];
            const duration = state.duration;
            const operation = state.state;
            // dry run. and get json commands
            this.Obniz.sendPool = [];
            operation(i);
            const pooledJsonArray = this.Obniz.sendPool;
            this.Obniz.sendPool = null;
            states.push({
                duration,
                state: pooledJsonArray,
            });
        }
        if (status === "loop" || status === "registrate") {
            obj.io.animation.states = states;
        }
        this.Obniz.send(obj);
    }
    repeatWait(array, repeat) {
        if (semver.lt(this.Obniz.firmware_ver, "2.0.0")) {
            throw new Error(`Please update obniz firmware >= 2.0.0`);
        }
        if (typeof repeat !== "number" || repeat < 1) {
            throw new Error("please specify repeat count > 0");
        }
        if (Math.floor(repeat) !== repeat) {
            throw new Error("please provide integer number like 1, 2, 3,,,");
        }
        return new Promise((resolve, reject) => {
            const name = "_repeatwait" + Date.now() + this._animationIdentifier;
            if (++this._animationIdentifier > 1000) {
                this._animationIdentifier = 0;
            }
            this.animation(name, "loop", array, repeat);
            this.addObserver(name, resolve, reject);
        });
    }
    notified(obj) {
        if (obj.animation.status === "finish") {
            for (let i = this.observers.length - 1; i >= 0; i--) {
                if (obj.animation.name === this.observers[i].name) {
                    this.observers[i].resolve();
                    this.observers.splice(i, 1);
                }
            }
        }
    }
}
exports.default = Directive;

//# sourceMappingURL=directive.js.map
