"use strict";
/**
 * @packageDocumentation
 * @module Parts.FSR40X
 */
Object.defineProperty(exports, "__esModule", { value: true });
class FSR40X {
    constructor() {
        this.pressure = 0;
        this.keys = ['pin0', 'pin1'];
        this.requiredKeys = ['pin0', 'pin1'];
    }
    static info() {
        return {
            name: 'FSR40X',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.io_pwr = obniz.getIO(this.params.pin0);
        this.ad = obniz.getAD(this.params.pin1);
        this.io_pwr.drive('5v');
        this.io_pwr.output(true);
        this.ad.start((value) => {
            const pressure = value * 100;
            this.pressure = pressure;
            if (this.onchange) {
                this.onchange(this.pressure);
            }
        });
    }
    async getWait() {
        const value = await this.ad.getWait();
        const pressure = value * 100;
        this.pressure = pressure;
        return this.pressure;
    }
}
exports.default = FSR40X;
