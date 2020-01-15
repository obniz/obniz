"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Potentiometer {
    static info() {
        return {
            name: "Potentiometer",
        };
    }
    constructor() {
        this.keys = ["pin0", "pin1", "pin2"];
        this.requiredKeys = ["pin0", "pin1", "pin2"];
        this.vcc_voltage = 5.0;
    }
    wired(obniz) {
        this.obniz.setVccGnd(this.params.pin0, this.params.pin2, "5v");
        this.ad = obniz.getAD(this.params.pin1);
        const self = this;
        obniz.getAD(this.params.pin0).start((value) => {
            self.vcc_voltage = value;
        });
        this.ad.start((value) => {
            self.position = value / self.vcc_voltage;
            if (self.onchange) {
                self.onchange(self.position);
            }
        });
    }
}
exports.default = Potentiometer;
//# sourceMappingURL=index.js.map