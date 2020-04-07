"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ObnizBLEHci {
    constructor(Obniz) {
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
    readWait(binaryFilter) {
        return new Promise((resolve) => {
            this.onceQueue(binaryFilter, resolve);
        });
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
