"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizError_1 = require("../../../ObnizError");
class ObnizBLEHci {
    constructor(Obniz) {
        /*
         * HCI level timeout should never occure. Response must be sent from a device.
         * This timeout is for just in case for a device nerver send response.
         */
        this.timeout = 90 * 1000;
        this._eventHandlerQueue = {};
        this.Obniz = Obniz;
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        this._eventHandlerQueue = {};
    }
    /**
     * Initialize BLE HCI module
     */
    init() {
        this.Obniz.send({
            ble: {
                hci: {
                    initialize: true,
                },
            },
        });
    }
    /**
     * Deinitalize BLE HCI module
     */
    end() {
        this.Obniz.send({
            ble: {
                hci: null,
            },
        });
    }
    /**
     * write HCI command to HCI module
     * @param hciCommand
     */
    write(hciCommand) {
        this.Obniz.send({
            ble: {
                hci: {
                    write: hciCommand,
                },
            },
        });
    }
    /**
     * @ignore
     * @param obj
     */
    notified(obj) {
        if (obj.read && obj.read.data) {
            this.Obniz._runUserCreatedFunction(this.onread, obj.read.data);
            for (const eventName in this._eventHandlerQueue) {
                if (typeof eventName !== "string" || !eventName.startsWith("[")) {
                    continue;
                }
                if (this._eventHandlerQueue[eventName].length === 0) {
                    continue;
                }
                const isValid = this.validate(eventName, obj);
                if (isValid) {
                    const func = this._eventHandlerQueue[eventName].shift();
                    if (func) {
                        func(Buffer.from(obj.read.data));
                    }
                }
            }
        }
    }
    /**
     * Callback on HCI command received.
     * @param data
     */
    onread(data) { }
    /**
     * @ignore
     * @private
     * @param promise
     * @param option.timeout Timeout number in seconds. If not specified. default timeout is applied. If null specified, never timeout.
     * @param option.waitingFor Readable description of command for waiting. Printed when Error or timeout occured.
     */
    timeoutPromiseWrapper(promise, option) {
        option = option || {};
        if (option.timeout === null) {
            option.timeout = null;
        }
        else {
            option.timeout = option.timeout || this.timeout;
            if (option.timeout < 0) {
                throw new ObnizError_1.ObnizParameterError(`option.timeout`, `0 or greater`);
            }
        }
        option.waitingFor = option.waitingFor || undefined;
        let onObnizClosed = null;
        let timeoutHandler = null;
        const clearListeners = () => {
            this.Obniz.off("close", onObnizClosed);
            if (timeoutHandler) {
                clearTimeout(timeoutHandler);
                timeoutHandler = null;
            }
        };
        const successPromise = promise.then((result) => {
            clearListeners();
            return result;
        }, (reason) => {
            clearListeners();
            throw reason;
        });
        const errorPromise = new Promise((resolve, reject) => {
            if (this.Obniz.connectionState !== "connected") {
                reject(new ObnizError_1.ObnizOfflineError());
                return;
            }
            onObnizClosed = () => {
                onObnizClosed = null;
                clearListeners();
                reject(new ObnizError_1.ObnizOfflineError());
            };
            this.Obniz.once("close", onObnizClosed);
            let onTimeout;
            if (option.onTimeout) {
                onTimeout = () => {
                    timeoutHandler = null;
                    clearListeners();
                    option
                        .onTimeout()
                        .then(() => {
                        reject(new ObnizError_1.ObnizTimeoutError(option.waitingFor));
                    })
                        .catch((e) => {
                        reject(e);
                    });
                };
            }
            else {
                onTimeout = () => {
                    timeoutHandler = null;
                    clearListeners();
                    reject(new ObnizError_1.ObnizTimeoutError(option.waitingFor));
                };
            }
            timeoutHandler = setTimeout(onTimeout, option.timeout);
        });
        if (option.timeout !== null) {
            return Promise.race([successPromise, errorPromise]);
        }
        return successPromise;
    }
    readWait(binaryFilter, option) {
        return this.timeoutPromiseWrapper(new Promise((resolve) => {
            this.onceQueue(binaryFilter, resolve);
        }), option);
    }
    onceQueue(binaryFilter, func) {
        const eventName = this.encodeBinaryFilter(binaryFilter);
        this._eventHandlerQueue[eventName] = this._eventHandlerQueue[eventName] || [];
        if (typeof func === "function") {
            this._eventHandlerQueue[eventName].push(func);
        }
    }
    validate(str, json) {
        const binaryFilter = this.decodeBinaryFilter(str);
        if (json.read.data.length < binaryFilter.length) {
            return false;
        }
        for (let i = 0; i < binaryFilter.length; i++) {
            if (binaryFilter[i] < 0) {
                continue;
            }
            if (binaryFilter[i] !== json.read.data[i]) {
                return false;
            }
        }
        return true;
    }
    encodeBinaryFilter(binary) {
        return JSON.stringify(binary);
    }
    decodeBinaryFilter(str) {
        return JSON.parse(str);
    }
}
exports.default = ObnizBLEHci;
