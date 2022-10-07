"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSCommandPlugin = void 0;
/**
 * @packageDocumentation
 * @ignore
 */
const WSCommandAbstract_1 = require("./WSCommandAbstract");
class WSCommandPlugin extends WSCommandAbstract_1.WSCommandAbstract {
    constructor() {
        super(...arguments);
        this.module = 15;
        this._CommandSend = 0;
        this._CommandReceive = 1;
    }
    send(params, index) {
        const buf = new Uint8Array(params.send);
        this.sendCommand(this._CommandSend, buf);
    }
    parseFromJson(json) {
        const module = json.plugin;
        if (module === undefined) {
            return;
        }
        const schemaData = [{ uri: '/request/plugin/send', onValid: this.send }];
        const res = this.validateCommandSchema(schemaData, module, 'plugin');
        if (res.valid === 0) {
            if (res.invalidButLike.length > 0) {
                throw new Error(res.invalidButLike[0].message);
            }
            else {
                throw new this.WSCommandNotFoundError(`[network]unknown command`);
            }
        }
    }
    notifyFromBinary(objToSend, func, payload) {
        switch (func) {
            case this._CommandReceive: {
                // convert buffer to array
                const arr = new Array(payload.byteLength);
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = payload[i];
                }
                objToSend.plugin = {
                    receive: arr,
                };
                break;
            }
        }
    }
}
exports.WSCommandPlugin = WSCommandPlugin;
