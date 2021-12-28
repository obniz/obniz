"use strict";
/**
 * @packageDocumentation
 * @module Parts.D6T44L
 */
Object.defineProperty(exports, "__esModule", { value: true });
class D6T44L {
    constructor() {
        this.requiredKeys = [];
        this.keys = ['vcc', 'gnd', 'sda', 'scl', 'clock'];
        this.address = 0x0a;
        this.ioKeys = ['vcc', 'gnd', 'sda', 'scl'];
        this.commands = {};
        this.commands.read_data = [0x4c];
    }
    static info() {
        return {
            name: 'D6T44L',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.params.clock = this.params.clock || 100 * 1000; // for i2c
        this.params.mode = this.params.mode || 'master'; // for i2c
        this.params.pull = this.params.pull || null; // for i2c
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.obniz.wait(50);
    }
    async getOnePixWait(pixcel) {
        const data = await this.getAllPixWait();
        return data[pixcel];
    }
    async getAllPixWait() {
        this.i2c.write(this.address, [0x4c]);
        // await obniz.wait(160);
        const raw = await this.i2c.readWait(this.address, 35);
        const data = [];
        for (let i = 0; i < 16; i++) {
            data[i] = parseFloat(((raw[i * 2 + 2] + (raw[i * 2 + 3] << 8)) * 0.1).toFixed(1));
        }
        return data;
    }
}
exports.default = D6T44L;
