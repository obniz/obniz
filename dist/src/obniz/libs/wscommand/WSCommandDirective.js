"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSCommandDirective = void 0;
/**
 * @packageDocumentation
 * @ignore
 */
const semver = require("semver");
const util_1 = require("../utils/util");
const WSCommandAbstract_1 = require("./WSCommandAbstract");
const WSCommandIO_1 = require("./WSCommandIO");
const WSCommandPWM_1 = require("./WSCommandPWM");
const WSCommandManager_1 = require("./WSCommandManager");
class WSCommandDirective extends WSCommandAbstract_1.WSCommandAbstract {
    constructor() {
        super();
        this.module = 1;
        this._CommandRegistrate = 0;
        this._CommandPause = 1;
        this._CommandResume = 2;
        this._CommandNotify = 3;
        this.subCommandManager = new WSCommandManager_1.WSCommandManager();
        this.subCommandManager.addCommandClass('WSCommandIO', WSCommandIO_1.WSCommandIO);
        this.subCommandManager.addCommandClass('WSCommandPWM', WSCommandPWM_1.WSCommandPWM);
        this.subCommandManager.createCommandInstances();
    }
    // Commands
    init(params, originalParams) {
        const nameArray = util_1.ObnizUtil.string2dataArray(params.animation.name);
        let frame;
        let offset = 0;
        if (semver.lt(this._hw.firmware || '1.0.0', '2.0.0')) {
            // < 2.0.0
            frame = new Uint8Array(1 + nameArray.length + 1);
            // name //
            frame[offset++] = nameArray.length + 1;
            frame.set(nameArray, offset);
            offset += nameArray.length;
            frame[offset++] = 0; // null string
            if (params.animation.status === 'registrate' ||
                typeof params.animation.repeat === 'number') {
                throw new Error('you need to update your firmware >= 2.0.0');
            }
        }
        else {
            frame = new Uint8Array(1 + nameArray.length + 1 + 1 + 4);
            // name //
            frame[offset++] = nameArray.length + 1;
            frame.set(nameArray, offset);
            offset += nameArray.length;
            frame[offset++] = 0; // null string
            // type and count //
            let type = 0;
            let repeat_count = 0;
            if (params.animation.status === 'loop') {
                type = 1; // auto start
            }
            if (typeof params.animation.repeat === 'number') {
                repeat_count = params.animation.repeat;
                type += 2;
            }
            frame[offset++] = type;
            frame[offset++] = repeat_count >> (8 * 3);
            frame[offset++] = repeat_count >> (8 * 2);
            frame[offset++] = repeat_count >> (8 * 1);
            frame[offset++] = repeat_count;
        }
        const commandJsonArray = params.animation.states;
        for (let i = 0; i < commandJsonArray.length; i++) {
            const obj = commandJsonArray[i];
            const duration = Math.floor(obj.duration * 1000);
            const state = obj.state;
            // Dry run commands
            let parsedCommands = JSON.parse(JSON.stringify(state));
            if (!Array.isArray(parsedCommands)) {
                parsedCommands = [parsedCommands];
            }
            let compressed = null;
            for (let commandIndex = 0; commandIndex < parsedCommands.length; commandIndex++) {
                const _frame = this.subCommandManager.compress(parsedCommands[commandIndex]);
                if (!_frame) {
                    throw new Error('[io.animation.states.state]only io or pwm commands. Please provide state at least one of them.');
                }
                if (compressed) {
                    const _combined = new Uint8Array(compressed.length + _frame.length);
                    _combined.set(compressed, 0);
                    _combined.set(_frame, compressed.length);
                    compressed = _combined;
                }
                else {
                    compressed = _frame;
                }
            }
            if (!compressed) {
                throw new Error('[io.animation.states.state]only io or pwm commands. Pleave provide state at least one of them.');
            }
            const length = compressed.byteLength;
            const commandHeader = new Uint8Array(8);
            commandHeader[0] = length >> (8 * 3);
            commandHeader[1] = length >> (8 * 2);
            commandHeader[2] = length >> (8 * 1);
            commandHeader[3] = length;
            commandHeader[4] = duration >> (8 * 3);
            commandHeader[5] = duration >> (8 * 2);
            commandHeader[6] = duration >> (8 * 1);
            commandHeader[7] = duration;
            const combined = new Uint8Array(frame.byteLength + commandHeader.byteLength + compressed.byteLength);
            combined.set(frame, 0);
            combined.set(commandHeader, frame.byteLength);
            combined.set(compressed, frame.byteLength + commandHeader.byteLength);
            frame = combined;
        }
        if (frame.byteLength > 1000) {
            // 1kbyte over
            throw new Error('[io.animation]Too big animation datas');
        }
        this.sendCommand(this._CommandRegistrate, frame);
    }
    changeState(params) {
        if (params.animation.status === 'resume') {
            const nameArray = util_1.ObnizUtil.string2dataArray(params.animation.name);
            const frame = new Uint8Array(nameArray.length + 2);
            frame[0] = nameArray.length + 1;
            frame.set(nameArray, 1);
            frame[frame.byteLength - 1] = 0;
            this.sendCommand(this._CommandResume, frame);
        }
        else if (params.animation.status === 'pause') {
            const nameArray = util_1.ObnizUtil.string2dataArray(params.animation.name);
            const frame = new Uint8Array(nameArray.length + 2);
            frame[0] = nameArray.length + 1;
            frame.set(nameArray, 1);
            frame[frame.byteLength - 1] = 0;
            this.sendCommand(this._CommandPause, frame);
        }
    }
    parseFromJson(json) {
        let parentCommandNotFound = false;
        try {
            super.parseFromJson(json);
        }
        catch (err) {
            if (err instanceof this.WSCommandNotFoundError) {
                parentCommandNotFound = true;
            }
            else {
                throw err;
            }
        }
        const module = json.io;
        if (module === undefined) {
            return;
        }
        const schemaData = [
            { uri: '/request/ioAnimation/init', onValid: this.init },
            { uri: '/request/ioAnimation/changeState', onValid: this.changeState },
        ];
        const res = this.validateCommandSchema(schemaData, module, 'io', module);
        if (res.valid === 0 && parentCommandNotFound) {
            if (res.invalidButLike.length > 0) {
                throw new Error(res.invalidButLike[0].message);
            }
            else {
                const WSCommandNotFoundError = this.WSCommandNotFoundError;
                throw new WSCommandNotFoundError(`[io.animation]unknown command`);
            }
        }
    }
    notifyFromBinary(objToSend, func, payload) {
        if (func === this._CommandNotify) {
            const name = util_1.ObnizUtil.dataArray2string(payload.slice(2, payload.byteLength - 1)); // remove null string
            objToSend.io = {
                animation: {
                    name,
                    status: 'finish',
                },
            };
        }
        else {
            super.notifyFromBinary(objToSend, func, payload);
        }
    }
}
exports.WSCommandDirective = WSCommandDirective;
