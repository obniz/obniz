"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObnizBLEHci = void 0;
const ObnizError_1 = require("../../../ObnizError");
class ObnizBLEHci {
    constructor(Obniz, extended) {
        /*
         * HCI level timeout should never occure. Response must be sent from a device.
         * This timeout is for just in case for a device nerver send response.
         */
        this.timeout = 90 * 1000;
        this._eventHandlerQueue = {};
        this.Obniz = Obniz;
        this._extended = extended;
        this.defaultExtended = this._extended;
    }
    /**
     * @ignore
     * @private
     */
    _reset(keepExtended) {
        this._eventHandlerQueue = {};
        if (!keepExtended) {
            this._extended = this.defaultExtended;
        }
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
     *
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
            if (this.onread === this.hciProtocolOnSocketData) {
                // obnizjs internal function
                this.onread(obj.read.data);
            }
            else {
                // user created function
                this.Obniz._runUserCreatedFunction(this.onread, obj.read.data);
            }
            for (const eventName in this._eventHandlerQueue) {
                if (typeof eventName !== 'string' || !eventName.startsWith('[')) {
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
     *
     * @param data
     */
    onread(data) {
        // do nothing.
    }
    /**
     * @ignore
     * @private
     * @param promise
     * @param option
     * @param option.timeout Timeout number in seconds. If not specified. default timeout is applied. If null specified, never timeout.
     * @param option.waitingFor Readable description of command for waiting. Printed when Error or timeout occured.
     */
    timeoutPromiseWrapper(promise, _option) {
        var _a;
        const option = {
            timeout: _option.timeout === null ? null : (_a = _option.timeout) !== null && _a !== void 0 ? _a : this.timeout,
            waitingFor: _option.waitingFor,
            onTimeout: _option.onTimeout || undefined,
        };
        if (option.timeout !== null && option.timeout < 0) {
            throw new ObnizError_1.ObnizParameterError(`option.timeout`, `0 or greater`);
        }
        let onObnizClosed = null;
        let timeoutHandler = null;
        const clearListeners = () => {
            if (onObnizClosed) {
                this.Obniz.off('close', onObnizClosed);
                onObnizClosed = null;
            }
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
            if (this.Obniz.connectionState !== 'connected') {
                reject(new ObnizError_1.ObnizOfflineError());
                return;
            }
            const offlineError = new ObnizError_1.ObnizOfflineError();
            onObnizClosed = () => {
                onObnizClosed = null;
                clearListeners();
                reject(offlineError);
            };
            this.Obniz.once('close', onObnizClosed);
            let onTimeout;
            if (option.onTimeout) {
                const timeoutError = new ObnizError_1.ObnizTimeoutError(option.waitingFor);
                onTimeout = () => {
                    timeoutHandler = null;
                    clearListeners();
                    if (option.onTimeout) {
                        option
                            .onTimeout()
                            .then(() => {
                            reject(timeoutError);
                        })
                            .catch((e) => {
                            reject(e);
                        });
                    }
                };
            }
            else {
                const timeoutError = new ObnizError_1.ObnizTimeoutError(option.waitingFor);
                onTimeout = () => {
                    timeoutHandler = null;
                    clearListeners();
                    reject(timeoutError);
                };
            }
            if (option.timeout !== null) {
                timeoutHandler = setTimeout(onTimeout, option.timeout);
            }
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
        this._eventHandlerQueue[eventName] =
            this._eventHandlerQueue[eventName] || [];
        if (typeof func === 'function') {
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
exports.ObnizBLEHci = ObnizBLEHci;
