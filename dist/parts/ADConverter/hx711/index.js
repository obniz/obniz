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
class hx711 {
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
        let ioKeys = ['clk', 'dout'];
        for (let key of ioKeys) {
            if (this.params[key] && !this.obniz.isValidIO(this.params[key])) {
                throw new Error("spi start param '" + key + "' are to be valid io no");
            }
        }
        this.sck = obniz.getIO(this.params.sck);
        this.dout = obniz.getIO(this.params.dout);
        this.sck.output(true);
        obniz.wait(500);
    }
    readWait() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sck.output(false);
            while (true) {
                let val = yield this.dout.inputWait();
                if (val == false)
                    break;
            }
            this.spi.start({
                mode: 'master',
                mosi: this.params.sck,
                miso: this.params.dout,
                frequency: 500 * 1000,
            });
            let ret_double = yield this.spi.writeWait([
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
            let ret = [
                this.doubleBit2singleBit(ret_double[0], ret_double[1]),
                this.doubleBit2singleBit(ret_double[2], ret_double[3]),
                this.doubleBit2singleBit(ret_double[4], ret_double[5]),
            ];
            let flag = (ret[0] & 0x80) === 0 ? 1 : -1;
            return flag * (((ret[0] & 0x7f) << 16) + (ret[1] << 8) + (ret[2] << 0));
        });
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
    readAverageWait(times) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = [];
            for (let i = 0; i < times; i++) {
                results.push(yield this.readWait());
            }
            return (results.reduce((prev, current, i) => {
                return prev + current;
            }, 0) / results.length);
        });
    }
    powerDown() {
        this.sck.output(true);
    }
    powerUp() {
        this.sck.output(false);
    }
    zeroAdjustWait(times) {
        return __awaiter(this, void 0, void 0, function* () {
            times = parseInt(times) || 1;
            this._offset = yield this.readAverageWait(times);
        });
    }
    getValueWait(times) {
        return __awaiter(this, void 0, void 0, function* () {
            times = parseInt(times) || 1;
            let val = yield this.readAverageWait(times);
            return (val - this._offset) / this._scale;
        });
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
if (typeof module === 'object') {
    module.exports = hx711;
}
