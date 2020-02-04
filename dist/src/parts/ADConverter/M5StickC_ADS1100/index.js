"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class M5StickC_ADS1100 {
    constructor() {
        this.keys = ["vcc", "gnd", "sda", "scl"];
        this.requiredKeys = ["sda", "scl"];
        this.address = 0x48;
        this.conversationDelay = 100;
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
        this.config = 0x00;
    }
    static info() {
        return {
            name: "M5StickC_ADS1100",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
    }
    updateConfig() {
        this.config = 0x00;
        this.config |= this.config_regs.OS_SINGLE;
        this.config |= this.config_regs.MODE_CONTIN;
        this.config |= this.config_regs.DR_8SPS;
        this.config |= this.config_regs.PGA_1;
    }
}
exports.default = M5StickC_ADS1100;

//# sourceMappingURL=index.js.map
