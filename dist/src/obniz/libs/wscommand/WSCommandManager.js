"use strict";
/**
 * @packageDocumentation
 * @ignore
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSCommandManager = void 0;
const WSSchema_1 = __importDefault(require("./WSSchema"));
const strict_event_emitter_1 = require("strict-event-emitter");
class WSCommandManager {
    constructor() {
        this.moduleNo2Name = {};
        this.commandClasses = {};
        this.commands = {};
        this.events = new strict_event_emitter_1.StrictEventEmitter();
    }
    static get schema() {
        return WSSchema_1.default;
    }
    addCommandClass(name, classObj) {
        this.commandClasses[name] = classObj;
    }
    createCommandInstances() {
        for (const [name, classObj] of Object.entries(this.commandClasses)) {
            this.commands[name] = new classObj();
            this.moduleNo2Name[this.commands[name].module] = name;
            this.commands[name].parsed = (module, func, payload) => {
                this.events.emit('binaryGenerated', module, func, payload);
            };
        }
    }
    getCommandInstance(name) {
        return this.commands[name];
    }
    getCommandInstanceByModule(module) {
        return this.commands[this.moduleNo2Name[module]];
    }
    framed(module, func, payload) {
        let payload_length = 0;
        if (payload) {
            payload_length = payload.length;
        }
        let length_type;
        if (payload_length <= 0x3f) {
            length_type = 0;
        }
        else if (payload_length <= 0x3fff) {
            length_type = 1;
        }
        else if (payload_length <= 0x3fffffff) {
            length_type = 2;
        }
        else {
            throw new Error('too big payload');
        }
        let length_extra_bytse = length_type === 0 ? 0 : length_type === 1 ? 1 : 3;
        const header_length = 3 + length_extra_bytse;
        const result = new Uint8Array(header_length + payload_length);
        let index = 0;
        result[index++] = module & 0x7f;
        result[index++] = func;
        result[index++] =
            (length_type << 6) | (payload_length >> (length_extra_bytse * 8));
        while (length_extra_bytse > 0) {
            length_extra_bytse--;
            result[index++] = payload_length >> (length_extra_bytse * 8);
        }
        if (payload_length === 0 || !payload) {
            return result;
        }
        else {
            result.set(payload, header_length);
            return result;
        }
    }
    /**
     * Dequeue a next wscommands from binary array.
     *
     * @param buf binary array received from obniz cloud.
     * @returns chunk
     */
    dequeueOne(buf) {
        if (!buf || buf.byteLength === 0) {
            return null;
        }
        if (buf.byteLength < 3) {
            throw new Error('something wrong. buf less than 3');
        }
        if (buf[0] & 0x80) {
            throw new Error('reserved bit 1');
        }
        const module = 0x7f & buf[0];
        const func = buf[1];
        const length_type = (buf[2] >> 6) & 0x3;
        const length_extra_bytse = length_type === 0 ? 0 : length_type === 1 ? 1 : 3;
        if (length_type === 4) {
            throw new Error('invalid length');
        }
        let length = (buf[2] & 0x3f) << (length_extra_bytse * 8);
        let index = 3;
        let shift = length_extra_bytse;
        while (shift > 0) {
            shift--;
            length += buf[index] << (shift * 8);
            index++;
        }
        return {
            module,
            func,
            payload: buf.slice(3 + length_extra_bytse, 3 + length_extra_bytse + length),
            raw: buf,
            next: buf.slice(3 + length_extra_bytse + length),
        };
    }
    /**
     * json to binary
     *
     * @param json
     */
    compress(json) {
        let ret = null;
        const append = (module, func, payload) => {
            const frame = this.framed(module, func, payload);
            if (ret) {
                const combined = new Uint8Array(ret.length + frame.length);
                combined.set(ret, 0);
                combined.set(frame, ret.length);
                ret = combined;
            }
            else {
                ret = frame;
            }
        };
        this.events.on('binaryGenerated', append);
        for (const [name, wscommand] of Object.entries(this.commands)) {
            wscommand.parseFromJson(json);
        }
        this.events.off('binaryGenerated', append);
        return ret;
    }
    binary2frame(data) {
        const payloads = [];
        while (data !== null) {
            const frame = this.dequeueOne(data);
            if (!frame) {
                break;
            }
            payloads.push({
                func: frame.func,
                module: frame.module,
                payload: frame.payload,
                raw: frame.raw,
            });
            data = frame.next;
        }
        return payloads;
    }
    frame2json(frame) {
        const obj = {};
        for (const [, command] of Object.entries(this.commands)) {
            if (command.module === frame.module) {
                command.notifyFromBinary(obj, frame.func, frame.payload);
                break;
            }
        }
        return obj;
    }
    binary2Json(data) {
        const frames = this.binary2frame(data);
        const json = frames.map((f) => this.frame2json(f));
        return json;
    }
    setHw(obj) {
        for (const [, command] of Object.entries(this.commands)) {
            command.setHw(obj);
        }
    }
}
exports.WSCommandManager = WSCommandManager;
