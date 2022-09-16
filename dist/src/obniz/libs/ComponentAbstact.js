"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentAbstract = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const ObnizError_1 = require("../ObnizError");
const WSSchema_1 = __importDefault(require("./wscommand/WSSchema"));
class ComponentAbstract extends eventemitter3_1.default {
    constructor(obniz) {
        super();
        /**
         * Rsponse waiting timeout in milliseconds
         */
        this.timeout = 30 * 1000;
        this._eventHandlerQueue = {};
        this.Obniz = obniz;
    }
    notifyFromObniz(json) {
        for (const eventName of this.eventNames()) {
            if (typeof eventName !== 'string' ||
                !eventName.startsWith('/response/')) {
                continue;
            }
            const isValid = this.fastValidate(eventName, json);
            if (isValid) {
                this.emit(eventName, json);
            }
        }
        for (const eventName in this._eventHandlerQueue) {
            if (typeof eventName !== 'string' ||
                !eventName.startsWith('/response/')) {
                continue;
            }
            if (this._eventHandlerQueue[eventName].length === 0) {
                continue;
            }
            const isValid = this.fastValidate(eventName, json);
            if (isValid) {
                const func = this._eventHandlerQueue[eventName].shift();
                if (func) {
                    func(json);
                }
            }
        }
    }
    validate(commandUri, json) {
        const schema = WSSchema_1.default.getSchema(commandUri);
        return WSSchema_1.default.validateMultiple(json, schema);
    }
    fastValidate(commandUri, json) {
        const schema = WSSchema_1.default.getSchema(commandUri);
        return WSSchema_1.default.validate(json, schema);
    }
    onceQueue(eventName, func) {
        this._eventHandlerQueue[eventName] =
            this._eventHandlerQueue[eventName] || [];
        if (typeof func === 'function') {
            this._eventHandlerQueue[eventName].push(func);
        }
    }
    removeFromOnceQueue(eventName, func) {
        this._eventHandlerQueue[eventName] =
            this._eventHandlerQueue[eventName] || [];
        if (typeof func === 'function') {
            this._eventHandlerQueue[eventName] = this._eventHandlerQueue[eventName].filter((e) => e !== func);
        }
    }
    async sendAndReceiveJsonWait(sendObj, schemaPath, option) {
        this.Obniz.send(sendObj);
        return await this.receiveJsonWait(schemaPath, option);
    }
    receiveJsonWait(schemaPath, option) {
        option = option || {};
        option.timeout = option.timeout || this.timeout;
        option.queue = option.queue !== false;
        option.errors = option.errors || {};
        return new Promise((resolve, reject) => {
            if (this.Obniz.connectionState !== 'connected') {
                reject(new ObnizError_1.ObnizOfflineError());
                return;
            }
            const clearListeners = () => {
                this.Obniz.off('close', onObnizClosed);
                if (option.queue) {
                    this.removeFromOnceQueue(schemaPath, onDataReceived);
                }
                else {
                    this.off(schemaPath, onDataReceived);
                }
                if (timeoutHandler !== undefined) {
                    clearTimeout(timeoutHandler);
                    timeoutHandler = undefined;
                }
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
                const error = new ObnizError_1.ObnizTimeoutError(schemaPath);
                reject(error);
            };
            const onErrorFuncs = [];
            this.Obniz.once('close', onObnizClosed);
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
                this.on(path, onError);
                onErrorFuncs.push({ onError, path });
            }
            let timeoutHandler = setTimeout(onTimeout, option.timeout);
        });
    }
}
exports.ComponentAbstract = ComponentAbstract;
