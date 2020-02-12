"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
const emitter = require("eventemitter3");
const bleHelper_1 = __importDefault(require("./bleHelper"));
/**
 * @category Use as Central
 */
class BleScan {
    constructor(obnizBle) {
        this.scanTarget = {};
        this.scanSettings = {};
        this.obnizBle = obnizBle;
        this.emitter = new emitter();
        this.scanedPeripherals = [];
        this._timeoutTimer = undefined;
    }
    start(target, settings) {
        this.obnizBle.warningIfNotInitialize();
        if (!settings) {
            settings = {};
        }
        const timeout = settings.duration || 30;
        settings.duplicate = !!settings.duplicate;
        this.scanSettings = settings;
        target = target || {};
        this.scanTarget = target;
        if (this.scanTarget &&
            this.scanTarget.uuids &&
            Array.isArray(this.scanTarget.uuids)) {
            this.scanTarget.uuids = this.scanTarget.uuids.map((elm) => {
                return bleHelper_1.default.uuidFilter(elm);
            });
        }
        this.scanedPeripherals = [];
        this.obnizBle.centralBindings.startScanning(null, false);
        this.clearTimeoutTimer();
        this._timeoutTimer = setTimeout(() => {
            this._timeoutTimer = undefined;
            this.end();
        }, timeout * 1000);
    }
    startOneWait(target, settings) {
        let state = 0;
        return new Promise((resolve) => {
            this.emitter.once("onfind", (param) => {
                if (state === 0) {
                    state = 1;
                    this.end();
                    resolve(param);
                }
            });
            this.emitter.once("onfinish", () => {
                if (state === 0) {
                    state = 1;
                    resolve(null);
                }
            });
            this.start(target, settings);
        });
    }
    startAllWait(target, settings) {
        return new Promise((resolve) => {
            this.emitter.once("onfinish", () => {
                resolve(this.scanedPeripherals);
            });
            this.start(target, settings);
        });
    }
    end() {
        this.clearTimeoutTimer();
        this.obnizBle.centralBindings.stopScanning();
    }
    isTarget(peripheral) {
        if (this.scanTarget &&
            this.scanTarget.localName &&
            peripheral.localName !== this.scanTarget.localName) {
            return false;
        }
        if (this.scanTarget && this.scanTarget.uuids) {
            const uuids = peripheral.advertisementServiceUuids().map((e) => {
                return bleHelper_1.default.uuidFilter(e);
            });
            for (const uuid of this.scanTarget.uuids) {
                if (!uuids.includes(uuid)) {
                    return false;
                }
            }
        }
        return true;
    }
    onfinish(data) {
    } // dummy
    onfind(params) {
    } // dummy
    notifyFromServer(notifyName, params) {
        switch (notifyName) {
            case "onfind": {
                if (this.scanSettings.duplicate === false) {
                    // duplicate filter
                    if (this.scanedPeripherals.find((e) => e.address === params.address)) {
                        break;
                    }
                }
                if (this.isTarget(params)) {
                    this.scanedPeripherals.push(params);
                    this.emitter.emit(notifyName, params);
                    this.onfind(params);
                }
                break;
            }
            case "onfinish": {
                this.clearTimeoutTimer();
                this.emitter.emit(notifyName, this.scanedPeripherals);
                this.onfinish(this.scanedPeripherals);
                break;
            }
        }
    }
    clearTimeoutTimer() {
        if (this._timeoutTimer) {
            clearTimeout(this._timeoutTimer);
            this._timeoutTimer = undefined;
        }
    }
}
exports.default = BleScan;

//# sourceMappingURL=bleScan.js.map
