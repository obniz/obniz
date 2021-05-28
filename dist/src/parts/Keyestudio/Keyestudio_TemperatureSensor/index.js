"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Keyestudio_TemperatureSensor {
    constructor() {
        this.temp = 0;
        this.temperature = 0;
        this.tempArray = new Array(100);
        this.sum = 0;
        this.init_count = 0;
        this.count = 0;
        this.keys = ['vcc', 'gnd', 'signal'];
        this.requiredKeys = ['signal'];
        this.drive = '5v';
    }
    static info() {
        return {
            name: 'Keyestudio_TemperatureSensor',
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
    onchange(temp) {
        // do nothing.
    }
    calc(voltage) {
        this.temperature = voltage * 100; // Temp(Celsius) = [AD Voltage] * 100;
        if (this.init_count < 100) {
            // initialization
            this.tempArray[this.init_count] = this.temperature;
            this.sum += this.temperature;
            this.init_count++;
            return this.sum / this.init_count;
        }
        else {
            // moving average
            if (this.count === 100) {
                this.count = 0;
            }
            this.sum -= this.tempArray[this.count]; // remove oldest temperature data
            this.tempArray[this.count] = this.temperature; // overwrite oldest temperature data to newest
            this.sum += this.temperature; // add newest temperature data
            this.count++;
            return this.sum / 100;
        }
    }
}
exports.default = Keyestudio_TemperatureSensor;
