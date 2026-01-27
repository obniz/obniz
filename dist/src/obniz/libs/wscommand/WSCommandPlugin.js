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
        this._CommandFrame = 2;
        this._CommandExec = 3;
        this._CommandDirective = 4;
    }
    send(params, index) {
        const buf = new Uint8Array(params.send);
        this.sendCommand(this._CommandSend, buf);
    }
    exec_lua(json) {
        const buf = Buffer.from(json.exec_lua, 'utf8');
        const result = new Uint8Array(buf);
        this.sendCommand(this._CommandExec, result);
    }
    reload_lua(json) {
        if (json.reload) {
            const buf = new Uint8Array(1);
            buf[0] = 1;
            this.sendCommand(this._CommandDirective, buf);
        }
    }
    parseFromJson(json) {
        const module = json.plugin;
        if (module === undefined) {
            return;
        }
        const schemaData = [
            { uri: '/request/plugin/send', onValid: this.send },
            { uri: '/request/plugin/exec_lua', onValid: this.exec_lua },
            { uri: '/request/plugin/reload_lua', onValid: this.reload_lua },
        ];
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
            case this._CommandFrame: {
                // convert buffer to array
                if (payload.length === 6 && payload[0] === 0) {
                    let length = 0;
                    const id = payload[1];
                    length += payload[2] << (3 * 8);
                    length += payload[3] << (2 * 8);
                    length += payload[4] << (1 * 8);
                    length += payload[5] << (0 * 8);
                    objToSend.plugin = {
                        frame: {
                            start: {
                                id,
                                length,
                            },
                        },
                    };
                }
                else if (payload.length === 1 && payload[0] === 1) {
                    objToSend.plugin = {
                        frame: {
                            end: {},
                        },
                    };
                }
                break;
            }
        }
    }
}
exports.WSCommandPlugin = WSCommandPlugin;
