"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_Speaker
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_Speaker {
    constructor() {
        this.keys = ["vcc", "gnd", "signal", "grove"];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: "Grove_Speaker",
        };
    }
    onchange(value) { }
    wired(obniz) {
        if (this.params.grove) {
            const grovePwm = this.params.grove.getDigital();
            this.pwm = grovePwm.primary;
        }
        else {
            this.obniz = obniz;
            this.obniz.setVccGnd(null, this.params.gnd, "5v");
            this.pwm = obniz.getFreePwm();
            this.pwm.start({ io: this.params.signal });
        }
    }
}
exports.default = Grove_Speaker;

//# sourceMappingURL=index.js.map
