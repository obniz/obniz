"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSCommandMotion = void 0;
/**
 * @packageDocumentation
 * @ignore
 */
const WSCommandAbstract_1 = require("./WSCommandAbstract");
class WSCommandMotion extends WSCommandAbstract_1.WSCommandAbstract {
    constructor() {
        super(...arguments);
        this.module = 19;
        this._CommandInit = 0;
        this._CommandDeinit = 1;
        this._CommandNotifyRawTemp = 2;
        this._CommandNotifyRawAcc = 3;
        this._CommandNotifyRecognition = 4;
    }
    // Commands
    init(params) {
        const buf = new Uint8Array(6);
        for (let i = 0; i < 6; i++) {
            buf[i] = 0;
        }
        // mode // 0 not change // 1 oneshot // 2 sensitive
        // param
        const modes = ['oneshot', 'sensitive'];
        if (params.temperature && typeof params.temperature === 'object') {
            const temperature = params.temperature;
            if (!modes.includes(temperature.mode)) {
                throw new Error('motion: temperature.mode is required');
            }
            if (temperature.mode === 'oneshot') {
                buf[0] = 1;
            }
            else {
                buf[0] = 2;
                buf[1] = clip100(temperature.sensitivity * 100);
            }
        }
        if (params.acceleration && typeof params.acceleration === 'object') {
            const acceleration = params.acceleration;
            if (!modes.includes(acceleration.mode)) {
                throw new Error('motion: acceleration.mode is required');
            }
            if (acceleration.mode === 'oneshot') {
                buf[2] = 1;
            }
            else {
                buf[2] = 2;
                buf[3] = clip100(acceleration.sensitivity * 100);
            }
        }
        if (params.recognition && typeof params.recognition === 'object') {
            const recognition = params.recognition;
            if (!modes.includes(recognition.mode)) {
                throw new Error('motion: recognition.mode is required');
            }
            if (recognition.mode === 'oneshot') {
                buf[4] = 1;
            }
            else {
                buf[4] = 2;
                buf[5] = clip100(recognition.sensitivity * 100);
            }
        }
        this.sendCommand(this._CommandInit, buf);
    }
    deinit(params) {
        const buf = new Uint8Array(0);
        this.sendCommand(this._CommandDeinit, buf);
    }
    parseFromJson(json) {
        const module = json.motion;
        if (!module)
            return;
        const schemaData = [
            { uri: '/request/motion/init', onValid: this.init },
            { uri: '/request/motion/deinit', onValid: this.deinit },
        ];
        const res = this.validateCommandSchema(schemaData, module, 'motion');
        if (res.valid === 0) {
            if (res.invalidButLike.length > 0) {
                throw new Error(res.invalidButLike[0].message);
            }
            else {
                throw new this.WSCommandNotFoundError('[motion]unknown commnad');
            }
        }
    }
    notifyFromBinary(objToSend, func, payload) {
        if (func === this._CommandNotifyRawTemp && payload.byteLength === 4) {
            const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
            const temperature = view.getFloat32(0, false); // big endigan
            objToSend.motion = {
                temperature,
            };
        }
        else if (func === this._CommandNotifyRawAcc &&
            payload.byteLength === 4 * 3) {
            const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
            const r = view.getFloat32(0, false); // big endigan
            const t = view.getFloat32(4, false); // big endigan
            const p = view.getFloat32(8, false); // big endigan
            objToSend.motion = {
                acceleration: {
                    r,
                    t,
                    p,
                },
            };
        }
        else if (func === this._CommandNotifyRecognition &&
            payload.byteLength === 2) {
            const recognition_id = payload[0];
            const possibility = payload[1];
            const RecognitionTable = {
                '0': 'none',
                '1': 'moving',
            };
            let recognition = RecognitionTable[recognition_id];
            if (recognition === undefined) {
                recognition = 'unknown';
            }
            objToSend.motion = {
                recognition: {
                    motion: recognition,
                    possibility: clip100(possibility) / 100,
                },
            };
        }
        else {
            super.notifyFromBinary(objToSend, func, payload);
        }
    }
}
exports.WSCommandMotion = WSCommandMotion;
const clip100 = (value) => {
    if (value > 100) {
        return 100;
    }
    if (value < 0) {
        return 0;
    }
    return value;
};
