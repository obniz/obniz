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
Object.defineProperty(exports, "__esModule", { value: true });
class KXSC7_2050 {
    constructor() {
        this.keys = ["x", "y", "z", "vcc", "gnd"];
        this.requiredKeys = ["x", "y", "z"];
    }
    static info() {
        return {
            name: "KXSC7-2050",
        };
    }
    wired(obniz) {
        return __awaiter(this, void 0, void 0, function* () {
            this.obniz = obniz;
            obniz.setVccGnd(this.params.vcc, this.params.gnd, "3v");
            this.ad_x = obniz.getAD(this.params.x);
            this.ad_y = obniz.getAD(this.params.y);
            this.ad_z = obniz.getAD(this.params.z);
            yield obniz.wait(500);
            const ad = obniz.getAD(this.params.vcc);
            const pwrVoltage = yield ad.getWait();
            const horizontalZ = yield this.ad_z.getWait();
            const sensitivity = pwrVoltage / 5; // Set sensitivity (unit:V)
            const offsetVoltage = horizontalZ - sensitivity; // Set offset voltage (Output voltage at 0g, unit:V)
            const self = this;
            this.ad_x.start((value) => {
                self.gravity = (value - offsetVoltage) / sensitivity;
                if (self.onchangex) {
                    self.onchangex(self.gravity);
                }
            });
            this.ad_y.start((value) => {
                self.gravity = (value - offsetVoltage) / sensitivity;
                if (self.onchangey) {
                    self.onchangey(self.gravity);
                }
            });
            this.ad_z.start((value) => {
                self.gravity = (value - offsetVoltage) / sensitivity;
                if (self.onchangez) {
                    self.onchangez(self.gravity);
                }
            });
        });
    }
}
exports.default = KXSC7_2050;

//# sourceMappingURL=index.js.map
