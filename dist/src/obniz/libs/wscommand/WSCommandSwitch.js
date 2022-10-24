"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSCommandSwitch = void 0;
/**
 * @packageDocumentation
 * @ignore
 */
const WSCommandAbstract_1 = require("./WSCommandAbstract");
class WSCommandSwitch extends WSCommandAbstract_1.WSCommandAbstract {
    constructor() {
        super(...arguments);
        this.module = 9;
        this._CommandNotifyValue = 0;
        this._CommandOnece = 1;
    }
    // Commands
    get(params) {
        const buf = new Uint8Array(0);
        this.sendCommand(this._CommandOnece, buf);
    }
    parseFromJson(json) {
        const module = json.switch;
        if (module === undefined) {
            return;
        }
        const schemaData = [{ uri: '/request/switch/get', onValid: this.get }];
        const res = this.validateCommandSchema(schemaData, module, 'switch');
        if (res.valid === 0) {
            if (res.invalidButLike.length > 0) {
                throw new Error(res.invalidButLike[0].message);
            }
            else {
                throw new this.WSCommandNotFoundError(`[switch]unknown command`);
            }
        }
    }
    notifyFromBinary(objToSend, func, payload) {
        if ((func === this._CommandOnece || func === this._CommandNotifyValue) &&
            payload.byteLength === 1) {
            const state = payload[0];
            const states = ['none', 'push', 'left', 'right'];
            objToSend.switch = {
                state: states[state],
            };
            if (func === this._CommandOnece) {
                objToSend.switch.action = 'get';
            }
        }
        else {
            super.notifyFromBinary(objToSend, func, payload);
        }
    }
}
exports.WSCommandSwitch = WSCommandSwitch;
