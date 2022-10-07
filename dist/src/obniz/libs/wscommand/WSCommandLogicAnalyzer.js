"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSCommandLogicAnalyzer = void 0;
/**
 * @packageDocumentation
 * @ignore
 */
const WSCommandAbstract_1 = require("./WSCommandAbstract");
class WSCommandLogicAnalyzer extends WSCommandAbstract_1.WSCommandAbstract {
    constructor() {
        super(...arguments);
        this.module = 10;
        this._CommandInit = 0;
        this._CommandDeinit = 1;
        this._CommandRecv = 2;
    }
    // Commands
    init(params) {
        const io = params.io[0];
        const intervalUsec = params.interval * 1000;
        const durationUsec = params.duration * 1000;
        const matchValue = parseInt(params.trigger.value);
        const matchCount = params.trigger.samples;
        const buf = new Uint8Array(12);
        buf[0] = 1;
        buf[1] = io;
        buf[2] = intervalUsec >> (8 * 3);
        buf[3] = intervalUsec >> (8 * 2);
        buf[4] = intervalUsec >> (8 * 1);
        buf[5] = intervalUsec;
        buf[6] = durationUsec >> (8 * 3);
        buf[7] = durationUsec >> (8 * 2);
        buf[8] = durationUsec >> (8 * 1);
        buf[9] = durationUsec;
        buf[10] = matchValue;
        buf[11] = matchCount;
        this.sendCommand(this._CommandInit, buf);
    }
    deinit(params) {
        const buf = new Uint8Array(0);
        this.sendCommand(this._CommandDeinit, buf);
    }
    parseFromJson(json) {
        const module = json.logic_analyzer;
        if (module === undefined) {
            return;
        }
        const schemaData = [
            { uri: '/request/logicAnalyzer/init', onValid: this.init },
            { uri: '/request/logicAnalyzer/deinit', onValid: this.deinit },
        ];
        const res = this.validateCommandSchema(schemaData, module, 'logic_analyzer');
        if (res.valid === 0) {
            if (res.invalidButLike.length > 0) {
                throw new Error(res.invalidButLike[0].message);
            }
            else {
                throw new this.WSCommandNotFoundError(`[logic_analyzer]unknown command`);
            }
        }
    }
    notifyFromBinary(objToSend, func, payload) {
        if (func === this._CommandRecv) {
            const arr = new Array(payload.byteLength * 8);
            let offset = 0;
            for (let i = 0; i < payload.byteLength; i++) {
                const byte = payload[i];
                for (let bit = 0; bit < 8; bit++) {
                    arr[offset] = byte & (0x80 >>> bit) ? 1 : 0;
                    offset++;
                }
            }
            objToSend.logic_analyzer = {
                data: arr,
            };
        }
        else {
            super.notifyFromBinary(objToSend, func, payload);
        }
    }
}
exports.WSCommandLogicAnalyzer = WSCommandLogicAnalyzer;
