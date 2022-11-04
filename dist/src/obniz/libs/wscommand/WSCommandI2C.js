"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSCommandI2C = void 0;
/**
 * @packageDocumentation
 * @ignore
 */
const WSCommandAbstract_1 = require("./WSCommandAbstract");
class WSCommandI2C extends WSCommandAbstract_1.WSCommandAbstract {
    constructor() {
        super(...arguments);
        this.module = 6;
        this._CommandInit = 0;
        this._CommandDeinit = 1;
        this._CommandWrite = 2;
        this._CommandRead = 3;
        this._CommandSlvWritten = 4;
    }
    // Commands
    initMaster(params, module) {
        const mode = 0;
        const sda = parseInt(params.sda);
        const scl = parseInt(params.scl);
        const clock = parseInt(params.clock);
        const buf = new Uint8Array(8);
        buf[0] = module;
        buf[1] = mode;
        buf[2] = sda;
        buf[3] = scl;
        buf[4] = clock >> (3 * 8);
        buf[5] = clock >> (2 * 8);
        buf[6] = clock >> (1 * 8);
        buf[7] = clock;
        this.sendCommand(this._CommandInit, buf);
    }
    initSlave(params, module) {
        const mode = 1;
        const sda = parseInt(params.sda);
        const scl = parseInt(params.scl);
        const clock = 0;
        let addressLength = params.slave_address_length;
        const address = params.slave_address;
        if (address > 0x7f) {
            addressLength = 10;
        }
        const buf = new Uint8Array(11);
        buf[0] = module;
        buf[1] = mode;
        buf[2] = sda;
        buf[3] = scl;
        buf[4] = clock >> (3 * 8);
        buf[5] = clock >> (2 * 8);
        buf[6] = clock >> (1 * 8);
        buf[7] = clock;
        buf[8] = addressLength;
        buf[9] = address >> 8;
        buf[10] = address;
        this.sendCommand(this._CommandInit, buf);
    }
    deinit(params, module) {
        const buf = new Uint8Array([module]);
        this.sendCommand(this._CommandDeinit, buf);
    }
    write(params, module) {
        let address = parseInt(params.address);
        if (params.address_bits === 10 || address > 0x7f) {
            address = address | 0x8000; // mark 10bit mode
        }
        const buf = new Uint8Array(3 + params.data.length);
        buf[0] = module;
        buf[1] = address >> 8;
        buf[2] = address;
        buf.set(params.data, 3);
        this.sendCommand(this._CommandWrite, buf);
    }
    read(params, module) {
        let address = parseInt(params.address);
        if (params.address_bits === 10 || address > 0x7f) {
            address = address | 0x8000; // mark 10bit mode
        }
        const read_length = params.read;
        const buf = new Uint8Array(7);
        buf[0] = module;
        buf[1] = address >> 8;
        buf[2] = address;
        buf[3] = read_length >> (3 * 8);
        buf[4] = read_length >> (2 * 8);
        buf[5] = read_length >> (1 * 8);
        buf[6] = read_length;
        this.sendCommand(this._CommandRead, buf);
    }
    parseFromJson(json) {
        // 0
        for (let i = 0; i < 2; i++) {
            const module = json['i2c' + i];
            if (module === undefined) {
                continue;
            }
            const schemaData = [
                { uri: '/request/i2c/init_master', onValid: this.initMaster },
                { uri: '/request/i2c/init_slave', onValid: this.initSlave },
                { uri: '/request/i2c/write', onValid: this.write },
                { uri: '/request/i2c/read', onValid: this.read },
                { uri: '/request/i2c/deinit', onValid: this.deinit },
            ];
            const res = this.validateCommandSchema(schemaData, module, 'i2c' + i, i);
            if (res.valid === 0) {
                if (res.invalidButLike.length > 0) {
                    throw new Error(res.invalidButLike[0].message);
                }
                else {
                    throw new this.WSCommandNotFoundError(`[i2c${i}]unknown command`);
                }
            }
        }
    }
    notifyFromBinary(objToSend, func, payload) {
        if (func === this._CommandRead && payload.byteLength > 3) {
            const module_index = payload[0];
            const address = (payload[1] << 8) + payload[2];
            const arr = new Array(payload.byteLength - 3);
            for (let i = 0; i < arr.length; i++) {
                arr[i] = payload[i + 3];
            }
            objToSend['i2c' + module_index] = {
                mode: 'master',
                address,
                data: arr,
            };
        }
        else if (func === this._CommandSlvWritten && payload.byteLength > 4) {
            const module_index = payload[0];
            // let address_bit_length = payload[1];
            const address = (payload[2] << 8) + payload[3];
            const arr = new Array(payload.byteLength - 4);
            for (let i = 0; i < arr.length; i++) {
                arr[i] = payload[i + 4];
            }
            objToSend['i2c' + module_index] = {
                mode: 'slave',
                is_fragmented: true,
                address,
                data: arr,
            };
        }
        else if (func === this.COMMAND_FUNC_ID_ERROR && payload.byteLength > 2) {
            // const _esperr = payload[0];
            const err = payload[1];
            const ref_func_id = payload[2];
            if (ref_func_id === this._CommandWrite ||
                ref_func_id === this._CommandRead) {
                let reason = '' +
                    (ref_func_id === this._CommandWrite ? 'writing' : 'reading') +
                    ' error. ';
                if (err === 7) {
                    // in fact. it is 0x107. but truncated
                    reason += 'Communication Timeout. Maybe, target is not connected.';
                }
                else if (err === 255) {
                    reason += 'Communication Failed. Maybe, target is not connected.';
                }
                this.envelopError(objToSend, `i2c0`, { message: reason });
            }
            else {
                super.notifyFromBinary(objToSend, func, payload);
            }
        }
        else {
            super.notifyFromBinary(objToSend, func, payload);
        }
    }
}
exports.WSCommandI2C = WSCommandI2C;
