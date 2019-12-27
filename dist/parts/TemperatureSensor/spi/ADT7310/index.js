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
class ADT7310 {
    constructor() {
        this.keys = ['vcc', 'gnd', 'frequency', 'din', 'dout', 'clk', 'spi'];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: 'ADT7310',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.params.mode = this.params.mode || 'master';
        this.params.frequency = this.params.frequency || 500000;
        this.params.mosi = this.params.din;
        this.params.miso = this.params.dout;
        this.spi = this.obniz.getSpiWithConfig(this.params);
    }
    getTempWait() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.spi.writeWait([0x54]); //send before each commands for stable
            yield this.obniz.wait(200);
            let ret = yield this.spi.writeWait([0x00, 0x00]);
            let tempBin = ret[0] << 8;
            tempBin |= ret[1];
            tempBin = tempBin >> 3;
            if (tempBin & 0x1000) {
                tempBin = tempBin - 8192;
            }
            return tempBin / 16;
        });
    }
}
if (typeof module === 'object') {
    module.exports = ADT7310;
}
