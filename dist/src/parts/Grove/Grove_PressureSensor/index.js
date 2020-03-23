"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_PressureSensor
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_PressureSensor {
    constructor() {
        this.keys = ["vcc", "gnd", "signal", "grove"];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: "Grove_PressureSensor",
        };
    }
    onchange(value) { }
    wired(obniz) {
        if (this.params.grove) {
            const groveAd = this.params.grove.getAnalog();
            this.ad = groveAd.primary;
        }
        else {
            this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
            this.ad = obniz.getAD(this.params.signal);
        }
        this.ad.start((value) => {
            if (this.onchange) {
                this.onchange(value);
            }
        });
    }
    async getWait() {
        return await this.ad.getWait();
    }
}
exports.default = Grove_PressureSensor;

//# sourceMappingURL=index.js.map
