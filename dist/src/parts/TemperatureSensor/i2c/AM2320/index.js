"use strict";
/**
 * @packageDocumentation
 * @module Parts.AM2320
 */
Object.defineProperty(exports, "__esModule", { value: true });
class AM2320 {
    constructor() {
        this.keys = ['vcc', 'gnd', 'sda', 'scl', 'i2c'];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: 'AM2320',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.address = 0x5c;
        this.params.pull = '5v';
        this.params.mode = 'master';
        this.params.clock = this.params.clock || 100 * 1000;
        this.i2c = obniz.getI2CWithConfig(this.params);
    }
    async getAllWait() {
        const i2cOnerror = this.i2c.onerror;
        this.i2c.onerror = () => {
            // do nothing.
        };
        this.i2c.write(this.address, [0]); // wake
        this.obniz.wait(2).catch(() => {
            /* ignore error */
        });
        this.i2c.write(this.address, [0x03, 0x00, 0x04]);
        this.obniz.wait(2).catch(() => {
            /* ignore error */
        });
        this.i2c.write(this.address, [0x03, 0x00, 0x04]);
        const ret = await this.i2c.readWait(this.address, 6);
        this.i2c.onerror = i2cOnerror;
        if (ret[0] !== 3 || ret[1] !== 4) {
            throw new Error(`Could not receive data correctly`);
        }
        const humidity = (ret[2] * 256 + ret[3]) / 10.0;
        const temperature = (ret[4] * 256 + ret[5]) / 10.0;
        return { temperature, humidity };
    }
    async getTempWait() {
        return (await this.getAllWait()).temperature;
    }
    async getHumdWait() {
        return await this.getHumidWait();
    }
    async getHumidWait() {
        return (await this.getAllWait()).humidity;
    }
}
exports.default = AM2320;
