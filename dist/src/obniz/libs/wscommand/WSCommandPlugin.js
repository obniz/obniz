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
        this._CommandLuaError = 5;
        // JS -> device: run lua and return the result (obniz.plugin.callWait)
        this._CommandCallRequest = 6;
        // device -> JS: result of a call request
        this._CommandCallResponse = 7;
        // device -> JS: lua asked the cloud to run a transaction (cloud.transactionWait)
        this._CommandCloudTransactionRequest = 8;
        // JS -> device: response to a cloud transaction
        this._CommandCloudTransactionResponse = 9;
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
    call_request(json) {
        const { id, lua } = json.call_request;
        const luaBuf = Buffer.from(lua, 'utf8');
        const buf = new Uint8Array(4 + luaBuf.length);
        buf[0] = (id >>> 24) & 0xff;
        buf[1] = (id >>> 16) & 0xff;
        buf[2] = (id >>> 8) & 0xff;
        buf[3] = id & 0xff;
        buf.set(luaBuf, 4);
        this.sendCommand(this._CommandCallRequest, buf);
    }
    cloud_transaction_response(json) {
        const { id, success, result } = json.cloud_transaction_response;
        const resultBuf = Buffer.from(result || '', 'utf8');
        const buf = new Uint8Array(5 + resultBuf.length);
        buf[0] = (id >>> 24) & 0xff;
        buf[1] = (id >>> 16) & 0xff;
        buf[2] = (id >>> 8) & 0xff;
        buf[3] = id & 0xff;
        buf[4] = success ? 1 : 0;
        buf.set(resultBuf, 5);
        this.sendCommand(this._CommandCloudTransactionResponse, buf);
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
            { uri: '/request/plugin/call_request', onValid: this.call_request },
            {
                uri: '/request/plugin/cloud_transaction_response',
                onValid: this.cloud_transaction_response,
            },
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
            case this._CommandLuaError: {
                const errorMessage = new TextDecoder().decode(payload);
                objToSend.plugin = {
                    error: {
                        message: errorMessage,
                    },
                };
                break;
            }
            case this._CommandCallResponse: {
                // [4B transaction_id BE][1B status][result]
                if (payload.length < 5) {
                    break;
                }
                const id = (payload[0] << 24) |
                    (payload[1] << 16) |
                    (payload[2] << 8) |
                    payload[3];
                const status = payload[4];
                const result = new TextDecoder().decode(payload.slice(5));
                objToSend.plugin = {
                    call_response: {
                        id: id >>> 0,
                        status,
                        result,
                    },
                };
                break;
            }
            case this._CommandCloudTransactionRequest: {
                // [4B transaction_id BE][data]
                if (payload.length < 4) {
                    break;
                }
                const id = (payload[0] << 24) |
                    (payload[1] << 16) |
                    (payload[2] << 8) |
                    payload[3];
                const data = new Array(payload.byteLength - 4);
                for (let i = 0; i < data.length; i++) {
                    data[i] = payload[i + 4];
                }
                objToSend.plugin = {
                    cloud_transaction_request: {
                        id: id >>> 0,
                        data,
                    },
                };
                break;
            }
        }
    }
}
exports.WSCommandPlugin = WSCommandPlugin;
