"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSCommandDisplay = void 0;
/**
 * @packageDocumentation
 * @ignore
 */
const qr_1 = __importDefault(require("../utils/qr"));
const WSCommandAbstract_1 = require("./WSCommandAbstract");
class WSCommandDisplay extends WSCommandAbstract_1.WSCommandAbstract {
    constructor() {
        super(...arguments);
        this.module = 8;
        this._CommandClear = 0;
        this._CommandPrint = 1;
        this._CommandDrawCampusVerticalBytes = 2;
        this._CommandDrawCampusHorizonalBytes = 3;
        this._CommandDrawIOState = 4;
        this._CommandSetPinName = 5;
        this._CommandDrawCampusRawColors = 6;
    }
    // Commands
    clear(params) {
        this.sendCommand(this._CommandClear, null);
    }
    print(buf) {
        this.sendCommand(this._CommandPrint, buf);
    }
    printText(text) {
        const buf = Buffer.from(text, 'utf8');
        const result = new Uint8Array(buf);
        this.print(result);
    }
    text(params) {
        this.printText(params.text);
    }
    raw(params) {
        if (typeof params.color_depth === 'number' && params.color_depth > 1) {
            this.drawRawColors(params.raw, params.color_depth);
        }
        else {
            this.drawHorizonally(new Uint8Array(params.raw));
        }
    }
    qr(params) {
        const text = params.qr.text;
        const correctionLevel = params.qr.correction || 'M';
        const typeNumber = 0; // auto detect type.
        const qr = (0, qr_1.default)(typeNumber, correctionLevel);
        qr.addData(text);
        qr.make();
        let size = qr.getModuleCount();
        if (size) {
            size *= 2;
            const modules = qr.getModules();
            const vram = new Uint8Array(1024);
            vram.fill(0);
            for (let row = 0; row < 2; row++) {
                for (let col = 0; col < size + 4; col++) {
                    vram[Math.floor(row * 16 + col / 8)] |= 0x80 >> col % 8;
                    vram[Math.floor((row + size + 2) * 16 + col / 8)] |= 0x80 >> col % 8;
                }
            }
            for (let row = 2; row < size + 2; row++) {
                for (let col = 0; col < 2; col++) {
                    vram[Math.floor(row * 16 + col / 8)] |= 0x80 >> col % 8;
                }
                for (let col = size + 2; col < size + 4; col++) {
                    vram[Math.floor(row * 16 + col / 8)] |= 0x80 >> col % 8;
                }
            }
            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    if (!modules[Math.floor(row / 2)][Math.floor(col / 2)]) {
                        vram[Math.floor((row + 2) * 16 + (col + 2) / 8)] |=
                            0x80 >> (col + 2) % 8;
                    }
                }
            }
            this.drawHorizonally(vram);
        }
    }
    pinName(params) {
        for (let i = 0; i < 40; i++) {
            if (typeof params.pin_assign[i] === 'object') {
                this.setPinName(i, params.pin_assign[i].module_name || '?', params.pin_assign[i].pin_name || '?');
            }
        }
    }
    drawVertically(buf) {
        this.sendCommand(this._CommandDrawCampusVerticalBytes, buf);
    }
    drawHorizonally(buf) {
        this.sendCommand(this._CommandDrawCampusHorizonalBytes, buf);
    }
    drawIOState(val) {
        const buf = new Uint8Array([!val ? 1 : 0]);
        this.sendCommand(this._CommandDrawIOState, buf);
    }
    setPinName(no, moduleName, pinName) {
        let str = moduleName.slice(0, 4) + ' ' + pinName;
        str = str.slice(0, 9);
        const buf = new Uint8Array(1);
        buf[0] = no;
        const stringarray = new Uint8Array(Buffer.from(str, 'utf8'));
        const combined = new Uint8Array(buf.length + stringarray.length);
        combined.set(buf, 0);
        combined.set(stringarray, 1);
        this.sendCommand(this._CommandSetPinName, combined);
    }
    drawRawColors(raw, colorDepth) {
        const buf = new Uint8Array(1 + raw.length);
        buf[0] = colorDepth;
        buf.set(raw, 1);
        this.sendCommand(this._CommandDrawCampusRawColors, buf);
    }
    parseFromJson(json) {
        const module = json.display;
        if (module === undefined) {
            return;
        }
        const schemaData = [
            { uri: '/request/display/clear', onValid: this.clear },
            { uri: '/request/display/text', onValid: this.text },
            { uri: '/request/display/raw', onValid: this.raw },
            { uri: '/request/display/pin_assign', onValid: this.pinName },
            { uri: '/request/display/qr', onValid: this.qr },
        ];
        const res = this.validateCommandSchema(schemaData, module, 'display');
        if (res.valid === 0) {
            if (res.invalidButLike.length > 0) {
                throw new Error(res.invalidButLike[0].message);
            }
            else {
                throw new this.WSCommandNotFoundError(`[display]unknown command`);
            }
        }
    }
}
exports.WSCommandDisplay = WSCommandDisplay;
