"use strict";
/**
 * @packageDocumentation
 * @module Parts.VL53L0X
 */
Object.defineProperty(exports, "__esModule", { value: true });
class VL53L0X {
    constructor() {
        this.requiredKeys = [];
        this.keys = ['vcc', 'gnd', 'sda', 'scl', 'i2c'];
        this.address = 0x29;
        this.regs = {
            IDENTIFICATION_MODEL_ID: 0xc0,
            IDENTIFICATION_REVISION_ID: 0xc2,
            PRE_RANGE_CONFIG_VCSEL_PERIOD: 0x50,
            FINAL_RANGE_CONFIG_VCSEL_PERIOD: 0x70,
            SYSRANGE_START: 0x00,
            RESULT_INTERRUPT_STATUS: 0x13,
            RESULT_RANGE_STATUS: 0x14,
        };
        this.acnt = 0;
        this.scnt = 0;
        this.status = 0;
    }
    static info() {
        return {
            name: 'VL53L0X',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '3v');
        this.obniz.wait(100);
        this.params.clock = 100000;
        this.params.pull = '3v';
        this.params.mode = 'master';
        this.i2c = obniz.getI2CWithConfig(this.params);
    }
    async getWait() {
        this.i2c.write(this.address, [this.regs.SYSRANGE_START, 0x01]);
        let val = [0];
        let cnt = 0;
        while (cnt < 10) {
            await this.obniz.wait(10);
            this.i2c.write(this.address, [this.regs.RESULT_RANGE_STATUS]);
            val = await this.i2c.readWait(this.address, 1);
            if (val[0] & 0x01) {
                break;
            }
            else {
                cnt++;
            }
        }
        if (!(val[0] & 0x01)) {
            return null;
        } // sensor not ready
        this.i2c.write(this.address, [0x14]);
        const gbuf = await this.i2c.readWait(this.address, 12);
        this.acnt = this.makeuint16(gbuf[7], gbuf[6]);
        this.scnt = this.makeuint16(gbuf[9], gbuf[8]);
        const dist = this.makeuint16(gbuf[11], gbuf[10]);
        this.status = (gbuf[0] & 0x78) >> 3;
        return dist;
    }
    makeuint16(lsb, msb) {
        return ((msb & 0xff) << 8) | (lsb & 0xff);
    }
}
exports.default = VL53L0X;
