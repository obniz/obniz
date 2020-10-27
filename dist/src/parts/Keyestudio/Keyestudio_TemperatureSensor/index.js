"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Keyestudio_TemperatureSensor {
    constructor() {
        this.temp = 0;
        this.keys = ["vcc", "gnd", "signal"];
        this.requiredKeys = ["signal"];
        this.drive = "5v";
    }
    static info() {
        return {
            name: "Keyestudio_TemperatureSensor",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, this.drive);
        this.ad = obniz.getAD(this.params.signal);
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
    onchange(temp) { }
    calc(voltage) {
        return voltage * 100; // Temp(Celsius) = [AD Voltage] * 100l;
    }
}
exports.default = Keyestudio_TemperatureSensor;
