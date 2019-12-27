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
class AnalogTemperatureSensor {
    constructor() {
        this.keys = ['vcc', 'gnd', 'output'];
        this.requiredKeys = ['output'];
        this.drive = '5v';
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, this.drive);
        this.ad = obniz.getAD(this.params.output);
        this.ad.start(function (voltage) {
            this.temp = this.calc(voltage);
            this.onchange(this.temp);
        }.bind(this));
    }
    getWait() {
        return __awaiter(this, void 0, void 0, function* () {
            let voltage = yield this.ad.getWait();
            this.temp = this.calc(voltage);
            return this.temp;
        });
    }
    onchange(temp) { }
    calc(voltage) {
        return 0;
    }
}
module.exports = AnalogTemperatureSensor;
