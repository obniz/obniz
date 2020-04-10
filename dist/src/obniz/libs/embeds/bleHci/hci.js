"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizError_1 = require("../../../ObnizError");
class ObnizBLEHci {
    constructor(Obniz) {
        this.timeout = 10 * 1000;
        this._eventHandlerQueue = {};
        this.Obniz = Obniz;
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
            this.onread(obj.read.data);
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
     * @param option
     */
    timeoutPromiseWrapper(promise, option) {
        option = option || {};
        option.timeout = option.timeout || this.timeout;
        let onObnizClosed = null;
        let timeoutHandler = null;
        const clearListeners = () => {
            this.Obniz.off("close", onObnizClosed);
            if (timeoutHandler) {
                clearTimeout(timeoutHandler);
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
            }
            onObnizClosed = () => {
                clearListeners();
                const error = new ObnizError_1.ObnizOfflineError();
                reject(error);
            };
            this.Obniz.on("close", onObnizClosed);
            const onTimeout = () => {
                clearListeners();
                const error = new ObnizError_1.ObnizTimeoutError();
                reject(error);
            };
            timeoutHandler = setTimeout(onTimeout, option.timeout);
        });
        return Promise.race([successPromise, errorPromise]);
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

//# sourceMappingURL=hci.js.map
