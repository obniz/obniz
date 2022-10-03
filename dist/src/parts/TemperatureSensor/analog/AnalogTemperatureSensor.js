"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AnalogTemperatureSensor {
    constructor() {
        this.temp = 0;
        this.keys = ['vcc', 'gnd', 'output'];
        this.requiredKeys = ['output'];
        this.drive = '5v';
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, this.drive);
        this.ad = obniz.getAD(this.params.output);
        this.ad.start((voltage) => {
            this.temp = this.calc(voltage);
            this.onchange(this.temp);
        });
    }
    async getWait() {
        const voltage = await this.ad.getWait();
        this.temp = this.calc(voltage);
        return this.temp;
    }
    onchange(temp) {
        // do nothing.
    }
    calc(voltage) {
        return 0;
    }
}
exports.default = AnalogTemperatureSensor;
