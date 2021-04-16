"use strict";
/**
 * @packageDocumentation
 * @module Parts.AK8963
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i2cCompass_1 = __importDefault(require("../../i2cCompass"));
class AK8963 extends i2cCompass_1.default {
    constructor() {
        super();
        this.defaultUnit = 'uT';
        this.i2cinfo = {
            address: 0x0c,
            clock: 100000,
            voltage: '3v',
            pull: '3v',
        };
        this.sf = this.defaultUnit;
        this.so = AK8963.scales.so_16bit;
        this.range = '4912uT';
    }
    static info() {
        return {
            name: 'AK8963',
        };
    }
    wired(obniz) {
        super.wired(obniz);
        this.setConfig(this.params.adc_cycle || 8);
    }
    setConfig(ADC_cycle) {
        switch (ADC_cycle) {
            case 8:
                this.write(0x0a, [0x12]); // 16bit
                break;
            case 100:
                this.write(0x0a, [0x16]); // 16bit
                break;
            default:
                throw new Error('Invalid ADC_cycle value. Valid values are 8,100.');
        }
    }
    async getAdcWait() {
        const raw = await this.readWait(0x03, 7);
        return AK8963.charArrayToXyz(raw, 'l');
    }
}
exports.default = AK8963;
AK8963.scales = {
    so_14bit: 4912 / 8190,
    so_16bit: 4912 / 32760,
};
