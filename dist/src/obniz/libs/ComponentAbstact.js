"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const ObnizError_1 = require("../ObnizError");
const WSSchema_1 = __importDefault(require("./wscommand/WSSchema"));
class ComponentAbstract extends eventemitter3_1.default {
    constructor(obniz) {
        super();
        this.timeout = 10 * 1000;
        this._eventHandlerQueue = {};
        this.Obniz = obniz;
        this._reset();
    }
    notifyFromObniz(json) {
        for (const eventName of this.eventNames()) {
            if (typeof eventName !== "string" || !eventName.startsWith("/response/")) {
                return;
            }
            const errors = this.validate(eventName, json);
            if (errors.valid) {
                this.emit(eventName, json);
            }
        }
        for (const eventName in this._eventHandlerQueue) {
            if (typeof eventName !== "string" || !eventName.startsWith("/response/")) {
                return;
            }
            const errors = this.validate(eventName, json);
            if (errors.valid) {
                const func = this._eventHandlerQueue[eventName].shift();
                if (func) {
                    func(json);
                }
            }
        }
    }
    validate(commandUri, json) {
        const schema = WSSchema_1.default.getSchema(commandUri);
        const results = WSSchema_1.default.validateMultiple(json, schema);
        return results;
    }
    onceQueue(eventName, func) {
        this._eventHandlerQueue[eventName] = this._eventHandlerQueue[eventName] || [];
        if (typeof func === "function") {
            this._eventHandlerQueue[eventName].push(func);
        }
    }
    async sendAndReceiveJsonWait(sendObj, schemaPath, option) {
        this.Obniz.send(sendObj);
        const result = await this.receiveJsonWait(schemaPath, option);
        return result;
    }
    receiveJsonWait(schemaPath, option) {
        option = option || {};
        option.timeout = option.timeout || this.timeout;
        option.queue = option.queue !== false;
        option.errors = option.errors || {};
        return new Promise((resolve, reject) => {
            if (this.Obniz.connectionState !== "connected") {
                reject();
            }
            const clearListeners = () => {
                this.Obniz.off("close", onObnizClosed);
                this.off(schemaPath, onDataReceived);
                clearTimeout(timeoutHandler);
                for (const one of onErrorFuncs) {
                    this.off(one.path, one.onError);
                }
            };
            const onObnizClosed = () => {
                clearListeners();
                const error = new ObnizError_1.ObnizOfflineError();
                reject(error);
            };
            const onDataReceived = (schemaData) => {
                clearListeners();
                resolve(schemaData);
            };
            const onTimeout = () => {
                clearListeners();
                const error = new ObnizError_1.ObnizTimeoutError();
                reject(error);
            };
            const onErrorFuncs = [];
            this.Obniz.once("close", onObnizClosed);
            if (option.queue) {
                this.onceQueue(schemaPath, onDataReceived);
            }
            else {
                this.once(schemaPath, onDataReceived);
            }
            for (const path in option.errors) {
                const onError = () => {
                    clearListeners();
                    const error = new option.errors[path]();
                    reject(error);
                };
                this.on(path, onDataReceived);
                onErrorFuncs.push({ onError, path });
            }
            const timeoutHandler = setTimeout(onTimeout, option.timeout);
        });
    }
}
exports.ComponentAbstract = ComponentAbstract;

//# sourceMappingURL=ComponentAbstact.js.map
