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
    getAllWait() {
        return __awaiter(this, void 0, void 0, function* () {
            let i2cOnerror = this.i2c.onerror;
            this.i2c.onerror = () => { };
            this.i2c.write(this.address, [0]); //wake
            this.obniz.wait(2);
            this.i2c.write(this.address, [0x03, 0x00, 0x04]);
            this.obniz.wait(2);
            this.i2c.write(this.address, [0x03, 0x00, 0x04]);
            let ret = yield this.i2c.readWait(this.address, 6);
            this.i2c.onerror = i2cOnerror;
            if (ret[0] != 3 || ret[1] != 4) {
                console.log('AM2320: Could not receive data correctly');
                return {};
            }
            let humidity = (ret[2] * 256 + ret[3]) / 10.0;
            let temperature = (ret[4] * 256 + ret[5]) / 10.0;
            return { temperature, humidity };
        });
    }
    getTempWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getAllWait()).temperature;
        });
    }
    getHumdWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.getAllWait()).humidity;
        });
    }
}
if (typeof module === 'object') {
    module.exports = AM2320;
}
