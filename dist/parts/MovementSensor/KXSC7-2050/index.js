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
class KXSC7_2050 {
    constructor() {
        this.keys = ['x', 'y', 'z', 'vcc', 'gnd'];
        this.requiredKeys = ['x', 'y', 'z'];
    }
    static info() {
        return {
            name: 'KXSC7-2050',
        };
    }
    wired(obniz) {
        return __awaiter(this, void 0, void 0, function* () {
            this.obniz = obniz;
            obniz.setVccGnd(this.params.vcc, this.params.gnd, '3v');
            this.ad_x = obniz.getAD(this.params.x);
            this.ad_y = obniz.getAD(this.params.y);
            this.ad_z = obniz.getAD(this.params.z);
            yield obniz.wait(500);
            let ad = obniz.getAD(this.params.vcc);
            let pwrVoltage = yield ad.getWait();
            let horizontalZ = yield this.ad_z.getWait();
            let sensitivity = pwrVoltage / 5; //Set sensitivity (unit:V)
            let offsetVoltage = horizontalZ - sensitivity; //Set offset voltage (Output voltage at 0g, unit:V)
            let self = this;
            this.ad_x.start(function (value) {
                self.gravity = (value - offsetVoltage) / sensitivity;
                if (self.onchangex) {
                    self.onchangex(self.gravity);
                }
            });
            this.ad_y.start(function (value) {
                self.gravity = (value - offsetVoltage) / sensitivity;
                if (self.onchangey) {
                    self.onchangey(self.gravity);
                }
            });
            this.ad_z.start(function (value) {
                self.gravity = (value - offsetVoltage) / sensitivity;
                if (self.onchangez) {
                    self.onchangez(self.gravity);
                }
            });
        });
    }
}
if (typeof module === 'object') {
    module.exports = KXSC7_2050;
}
