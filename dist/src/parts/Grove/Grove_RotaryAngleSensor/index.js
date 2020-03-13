"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_RotaryAngleSensor
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_RotaryAngleSensor {
    constructor() {
        // public vcc_voltage = 5.0;
        this.position = 0;
        this.keys = ["signal", "vcc", "gnd"];
        this.requiredKeys = ["signal"];
        this.drive = "5v";
    }
    static info() {
        return {
            name: "Grove_RotaryAngleSensor",
        };
    }
    wired(obniz) {
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, this.drive);
        this.ad = obniz.getAD(this.params.signal);
        this.ad.start((value) => {
            this.position = value;
            if (this.onchange) {
                this.onchange(this.position);
            }
        });
    }
}
exports.default = Grove_RotaryAngleSensor;

//# sourceMappingURL=index.js.map
