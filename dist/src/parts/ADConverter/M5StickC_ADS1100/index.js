"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class M5StickC_ADS1100 {
    constructor() {
        this.keys = ["vcc", "gnd", "sda", "scl", "i2c"];
        this.requiredKeys = ["sda", "scl"];
        this.address = 0x48;
        this.conversionDelay = 100;
        this.config_regs = {
            OS_MASK: 0x80,
            OS_NOEFFECT: 0x00,
            OS_SINGLE: 0x80,
            OS_BUSY: 0x00,
            OS_NOTBUSY: 0x80,
            MODE_MASK: 0x10,
            MODE_CONTIN: 0x00,
            MODE_SINGLE: 0x10,
            DR_MASK: 0x0C,
            DR_128SPS: 0x00,
            DR_32SPS: 0x04,
            DR_16SPS: 0x08,
            DR_8SPS: 0x0C,
            PGA_MASK: 0x03,
            PGA_1: 0x00,
            PGA_2: 0x01,
            PGA_4: 0x02,
            PGA_8: 0x03,
        };
        this.os = this.config_regs.OS_SINGLE;
        this.mode = this.config_regs.MODE_CONTIN;
        this.dataRate = this.config_regs.DR_8SPS;
        this.pga = this.config_regs.PGA_1;
        this.minCode = 32768;
        this.updateConfig();
    }
    static info() {
        return {
            name: "M5StickC_ADS1100",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.params.mode = "master";
        this.params.clock = 400000;
        this.params.pull = "5v";
        this.i2c = this.obniz.getI2CWithConfig(this.params);
        this.obniz.wait(100);
    }
    getVoltageWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield this.getWait();
            const voltage = raw * 3.3 / (this.minCode) * 4 * 1000;
            return voltage;
        });
    }
    setRate(dataRate) {
        switch (dataRate) {
            case 8:
                this.dataRate = this.config_regs.DR_8SPS;
                this.minCode = 32768;
                break;
            case 16:
                this.dataRate = this.config_regs.DR_16SPS;
                this.minCode = 16384;
                break;
            case 32:
                this.dataRate = this.config_regs.DR_32SPS;
                this.minCode = 8192;
                break;
            case 128:
                this.dataRate = this.config_regs.DR_128SPS;
                this.minCode = 2048;
                break;
            default:
                throw new Error(`argument must be selected from 8, 16, 32, 128.`);
        }
    }
    setGain(gain) {
        switch (gain) {
            case 1:
                this.pga = this.config_regs.PGA_1;
                break;
            case 2:
                this.pga = this.config_regs.PGA_2;
                break;
            case 4:
                this.pga = this.config_regs.PGA_4;
                break;
            case 8:
                this.pga = this.config_regs.PGA_8;
                break;
            default:
                throw new Error(`argument must be selected from 1, 2, 4, 8.`);
        }
    }
    setMode(mode) {
        switch (mode) {
            case "CONTIN":
                this.mode = this.config_regs.MODE_CONTIN;
                break;
            case "SINGLE":
                this.mode = this.config_regs.MODE_SINGLE;
                break;
            default:
                throw new Error(`argument must be selected from "CONTIN" or "SINGLE".`);
        }
    }
    getWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.updateConfig();
            this.i2c.write(this.address, [this.config]);
            yield this.obniz.wait(this.conversionDelay);
            const ret = yield this.i2c.readWait(this.address, 2);
            return ((ret[0] << 8) | ret[1]);
        });
    }
    updateConfig() {
        this.config = 0x00;
        this.config |= this.os;
        this.config |= this.mode;
        this.config |= this.dataRate;
        this.config |= this.pga;
    }
}
exports.default = M5StickC_ADS1100;

//# sourceMappingURL=index.js.map
