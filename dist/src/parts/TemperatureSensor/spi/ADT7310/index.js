"use strict";
/**
 * @packageDocumentation
 * @module Parts.ADT7310
 */
Object.defineProperty(exports, "__esModule", { value: true });
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
    async getTempWait() {
        await this.spi.writeWait([0x54]); // send before each commands for stable
        await this.obniz.wait(200);
        const ret = await this.spi.writeWait([0x00, 0x00]);
        let tempBin = ret[0] << 8;
        tempBin |= ret[1];
        tempBin = tempBin >> 3;
        if (tempBin & 0x1000) {
            tempBin = tempBin - 8192;
        }
        return tempBin / 16;
    }
}
exports.default = ADT7310;
