"use strict";
/**
 * @packageDocumentation
 * @module Parts.HMC5883L
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i2cCompass_1 = __importDefault(require("../../i2cCompass"));
class HMC5883L extends i2cCompass_1.default {
    constructor() {
        super();
        this.defaultUnit = 'G';
        this.i2cinfo = {
            address: 0x1e,
            clock: 100000,
            voltage: '3v',
            pull: '3v',
        };
        this.sf = this.defaultUnit;
        this.so = HMC5883L.scales[1];
        this.range = '8G';
    }
    static info() {
        return {
            name: 'HMC5883L',
        };
    }
    wired(obniz) {
        super.wired(obniz);
        // this.obniz.wait(500);
        this.init();
    }
    init() {
        this.reset();
        // this.obniz.wait(500);
    }
    reset() {
        this.write(HMC5883L.commands.mode, 0x00);
    }
    async getAdcWait() {
        const raw = await this.readWait(HMC5883L.commands.x_MSB, 6);
        return HMC5883L.charArrayToXyz(raw, 'b');
    }
    setRange(index) {
        this.write(HMC5883L.commands.config_b, index << 5);
        this.so = HMC5883L.scales[index];
    }
    /**
     * @deprecated
     */
    get() {
        return this.getWait();
    }
}
exports.default = HMC5883L;
HMC5883L.commands = {
    config_a: 0x00,
    config_b: 0x01,
    mode: 0x02,
    x_MSB: 0x03,
    status: 0x09,
};
HMC5883L.scales = [
    1 / 1370,
    1 / 1090,
    1 / 820,
    1 / 660,
    1 / 440,
    1 / 390,
    1 / 330,
    1 / 230,
];
