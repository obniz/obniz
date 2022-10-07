"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSCommandIO = void 0;
/**
 * @packageDocumentation
 * @ignore
 */
const WSCommandAbstract_1 = require("./WSCommandAbstract");
const COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_HIGH = 1;
const COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_LOW = 2;
const COMMAND_IO_ERRORS_IO_TOO_LOW = 3;
const COMMAND_IO_ERRORS_IO_TOO_HIGH = 4;
const COMMAND_IO_ERRORS_IO_FORCE_RELEASED = 0xf0;
const COMMAND_IO_ERROR_MESSAGES = {
    0: 'unknown error',
    1: 'heavy output. output voltage is too low when driving high',
    2: 'heavy output. output voltage is too high when driving low',
    3: 'output voltage is too low when driving high. io state has changed output to input',
    4: 'output voltage is too high when driving low. io state has changed output to input',
};
const COMMAND_IO_MUTEX_NAMES = {
    1: 'io.input',
    2: 'io.output',
    3: 'pwm',
    4: 'uart',
    5: 'i2c',
    6: 'spi',
    7: 'LogicAnalyzer',
    8: 'Measure',
};
class WSCommandIO extends WSCommandAbstract_1.WSCommandAbstract {
    constructor() {
        super(...arguments);
        this.module = 2;
        this._CommandOutput = 0;
        this._CommandInputStream = 1;
        this._CommandInputOnece = 2;
        this._CommandOutputType = 3;
        this._CommandPullResisterType = 4;
        this._CommandEnd = 5;
    }
    // Commands
    output(value, id) {
        const buf = new Uint8Array([id, value]);
        this.sendCommand(this._CommandOutput, buf);
    }
    outputDetail(params, id) {
        const buf = new Uint8Array([id, params.value]);
        this.sendCommand(this._CommandOutput, buf);
    }
    input(params, id) {
        const buf = new Uint8Array([id]);
        this.sendCommand(this._CommandInputOnece, buf);
    }
    inputDetail(params, id) {
        const buf = new Uint8Array([id]);
        this.sendCommand(params.stream ? this._CommandInputStream : this._CommandInputOnece, buf);
    }
    outputType(params, id) {
        const buf = new Uint8Array(2);
        buf[0] = id;
        if (params.output_type === 'push-pull5v') {
            buf[1] = 0;
        }
        else if (params.output_type === 'push-pull3v') {
            buf[1] = 2;
        }
        else if (params.output_type === 'open-drain') {
            buf[1] = 3;
        }
        else {
            return 'io unknown outputtype: ' + params.output_type;
        }
        this.sendCommand(this._CommandOutputType, buf);
    }
    pullType(params, id) {
        const buf = new Uint8Array(2);
        buf[0] = id;
        if (params.pull_type === 'float') {
            buf[1] = 0;
        }
        else if (params.pull_type === 'pull-up3v') {
            buf[1] = 1;
        }
        else if (params.pull_type === 'pull-down') {
            buf[1] = 2;
        }
        else if (params.pull_type === 'pull-up5v') {
            buf[1] = 3;
        }
        else {
            return 'io unknown pull_type: ' + params.pull_type;
        }
        this.sendCommand(this._CommandPullResisterType, buf);
    }
    deinit(params, id) {
        const buf = new Uint8Array([id]);
        this.sendCommand(this._CommandEnd, buf);
    }
    parseFromJson(json) {
        for (let i = 0; i < 40; i++) {
            const module = json['io' + i];
            if (module === undefined) {
                continue;
            }
            const schemaData = [
                { uri: '/request/io/input', onValid: this.input },
                { uri: '/request/io/input_detail', onValid: this.inputDetail },
                { uri: '/request/io/output', onValid: this.output },
                { uri: '/request/io/output_detail', onValid: this.outputDetail },
                { uri: '/request/io/output_type', onValid: this.outputType },
                { uri: '/request/io/pull_type', onValid: this.pullType },
                { uri: '/request/io/deinit', onValid: this.deinit },
            ];
            const res = this.validateCommandSchema(schemaData, module, 'io' + i, i);
            if (res.valid === 0) {
                if (res.invalidButLike.length > 0) {
                    throw new Error(res.invalidButLike[0].message);
                }
                else {
                    throw new this.WSCommandNotFoundError(`[io${i}]unknown command`);
                }
            }
        }
    }
    notifyFromBinary(objToSend, func, payload) {
        if (func === this._CommandInputStream || func === this._CommandInputOnece) {
            for (let i = 0; i < payload.byteLength; i += 2) {
                objToSend['io' + payload[i]] = payload[i + 1] > 0;
            }
        }
        else if (func === this.COMMAND_FUNC_ID_ERROR && payload.byteLength >= 4) {
            // const esperr = payload[0];
            const err = payload[1];
            // const ref_func_id = payload[2];
            const module_index = payload[3];
            if (err === COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_HIGH ||
                err === COMMAND_IO_ERRORS_IO_TOO_HEAVY_WHEN_LOW) {
                this.envelopWarning(objToSend, `io${module_index}`, {
                    message: COMMAND_IO_ERROR_MESSAGES[err],
                });
            }
            else if (err === COMMAND_IO_ERRORS_IO_TOO_LOW ||
                err === COMMAND_IO_ERRORS_IO_TOO_HIGH) {
                this.envelopError(objToSend, `io${module_index}`, {
                    message: COMMAND_IO_ERROR_MESSAGES[err],
                });
            }
            else if (err === COMMAND_IO_ERRORS_IO_FORCE_RELEASED &&
                payload.byteLength >= 6) {
                const oldMutexOwner = payload[4];
                const newMutexOwner = payload[5];
                this.envelopWarning(objToSend, 'debug', {
                    message: `io${module_index} binded "${COMMAND_IO_MUTEX_NAMES[oldMutexOwner]}" was stopped. "${COMMAND_IO_MUTEX_NAMES[newMutexOwner]}" have started using this io.`,
                });
            }
        }
        else {
            super.notifyFromBinary(objToSend, func, payload);
        }
    }
}
exports.WSCommandIO = WSCommandIO;
