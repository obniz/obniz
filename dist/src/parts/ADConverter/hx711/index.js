"use strict";
/**
 * @packageDocumentation
 * @module Parts.hx711
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Hx711 {
    constructor() {
        this.keys = ['vcc', 'gnd', 'sck', 'dout'];
        this.requiredKeys = ['sck', 'dout'];
        this._offset = 0;
        this._scale = 1;
    }
    static info() {
        return {
            name: 'hx711',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.spi = obniz.getFreeSpi();
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        const ioKeys = ['clk', 'dout'];
        for (const key of ioKeys) {
            if (this.params[key] && !this.obniz.isValidIO(this.params[key])) {
                throw new Error("spi start param '" + key + "' are to be valid io no");
            }
        }
        this.sck = obniz.getIO(this.params.sck);
        this.dout = obniz.getIO(this.params.dout);
        this.sck.output(true);
        obniz.wait(500);
    }
    async readWait() {
        this.sck.output(false);
        while (true) {
            const val = await this.dout.inputWait();
            if (val === false) {
                break;
            }
        }
        this.spi.start({
            mode: 'master',
            mosi: this.params.sck,
            miso: this.params.dout,
            frequency: 500 * 1000,
        });
        const ret_double = await this.spi.writeWait([
            0xaa,
            0xaa,
            0xaa,
            0xaa,
            0xaa,
            0xaa,
            0x80,
        ]);
        this.spi.end(true);
        this.sck.output(false);
        const ret = [
            this.doubleBit2singleBit(ret_double[0], ret_double[1]),
            this.doubleBit2singleBit(ret_double[2], ret_double[3]),
            this.doubleBit2singleBit(ret_double[4], ret_double[5]),
        ];
        const flag = (ret[0] & 0x80) === 0 ? 1 : -1;
        return flag * (((ret[0] & 0x7f) << 16) + (ret[1] << 8) + (ret[2] << 0));
    }
    doubleBit2singleBit(a, b) {
        return ((this.bit(a, 7) << 7) |
            (this.bit(a, 5) << 6) |
            (this.bit(a, 3) << 5) |
            (this.bit(a, 1) << 4) |
            (this.bit(b, 7) << 3) |
            (this.bit(b, 5) << 2) |
            (this.bit(b, 3) << 1) |
            (this.bit(b, 1) << 0));
    }
    bit(a, n) {
        return a & (1 << n) ? 1 : 0;
    }
    async readAverageWait(times) {
        const results = [];
        for (let i = 0; i < times; i++) {
            results.push(await this.readWait());
        }
        return (results.reduce((prev, current, i) => {
            return prev + current;
        }, 0) / results.length);
    }
    powerDown() {
        this.sck.output(true);
    }
    powerUp() {
        this.sck.output(false);
    }
    async zeroAdjustWait(times) {
        times = parseInt(times) || 1;
        this._offset = await this.readAverageWait(times);
    }
    async getValueWait(times) {
        times = parseInt(times) || 1;
        const val = await this.readAverageWait(times);
        return (val - this._offset) / this._scale;
    }
    setOffset(offset) {
        if (typeof offset !== 'number') {
            throw new Error('offset variable is Number');
        }
        this._offset = offset;
    }
    setScale(scale) {
        if (typeof scale !== 'number') {
            throw new Error('scale variable is Number');
        }
        this._scale = scale;
    }
}
exports.default = Hx711;
