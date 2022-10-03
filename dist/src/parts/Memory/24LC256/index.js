"use strict";
/**
 * @packageDocumentation
 * @module Parts.24LC256
 */
Object.defineProperty(exports, "__esModule", { value: true });
class _24LC256 {
    constructor() {
        this.requiredKeys = ['address'];
        this.keys = ['sda', 'scl', 'clock', 'pull', 'i2c', 'address'];
    }
    static info() {
        return {
            name: '24LC256',
        };
    }
    wired(obniz) {
        this.params.mode = this.params.mode || 'master'; // for i2c
        this.params.clock = this.params.clock || 400 * 1000; // for i2c
        this.i2c = obniz.getI2CWithConfig(this.params);
    }
    // Module functions
    set(address, data) {
        const array = [];
        array.push((address >> 8) & 0xff);
        array.push(address & 0xff);
        array.push(...data);
        this.i2c.write(0x50, array);
        this.obniz.wait(4 + 1); // write cycle time = 4ms for 24XX00, 1.5ms for 24C01C, 24C02C
    }
    async getWait(address, length) {
        const array = [];
        array.push((address >> 8) & 0xff);
        array.push(address & 0xff);
        this.i2c.write(0x50, array);
        return await this.i2c.readWait(0x50, length);
    }
}
exports.default = _24LC256;
