"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_WaterLevelSensor
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_WaterLevelSensor {
    constructor() {
        this.onchange = null;
        this.keys = ['gnd', 'vcc', 'sda', 'scl', 'grove'];
        this.requiredKeys = [];
        this.ioKeys = this.keys;
        this.displayName = 'WaterLevel';
        this.displayIoNames = { sda: 'sda', scl: 'scl' };
        this.THRESHOLD = 100;
        this.ATTINY1_HIGH_ADDR = 0x78;
        this.ATTINY2_LOW_ADDR = 0x77;
        this.check_interval_ms = 1000;
        this.previous_val = 0;
    }
    static info() {
        return {
            name: 'Grove_WaterLevelSensor',
        };
    }
    wired(obniz) {
        if (this.params.grove) {
            this.i2c = this.params.grove.getI2c(400000, '5v');
        }
        else {
            this.vcc = this.params.vcc;
            this.gnd = this.params.gnd;
            this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
            this.params.clock = 400000;
            this.params.mode = 'master';
            this.i2c = obniz.getI2CWithConfig(this.params);
        }
        this.initWait();
    }
    async initWait() {
        // power on
        while (true) {
            const current_val = await this.getWait();
            if (current_val !== this.previous_val) {
                if (this.onchange) {
                    this.onchange(current_val);
                }
                this.previous_val = current_val;
            }
            await this.obniz.wait(this.check_interval_ms);
        }
    }
    async getWait() {
        const water_level_step = 5; // 5 mm step
        const high_data = await this.i2c.readWait(this.ATTINY1_HIGH_ADDR, 12);
        const low_data = await this.i2c.readWait(this.ATTINY2_LOW_ADDR, 8);
        let i;
        let touch_val = 0;
        for (i = 0; i < 8; i++) {
            if (low_data[i] > this.THRESHOLD) {
                touch_val |= 1 << i;
            }
        }
        for (i = 0; i < 12; i++) {
            if (high_data[i] > this.THRESHOLD) {
                touch_val |= 1 << (8 + i);
            }
        }
        let trig_section = 0;
        while (touch_val & 0x01) {
            trig_section++;
            touch_val >>= 1;
        }
        const water_level_mm = trig_section * water_level_step;
        return water_level_mm;
    }
}
exports.default = Grove_WaterLevelSensor;
