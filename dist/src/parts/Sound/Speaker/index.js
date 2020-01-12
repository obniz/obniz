"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Speaker {
    static info() {
        return {
            name: "Speaker",
        };
    }
    constructor(obniz) {
        this.keys = ["signal", "gnd"];
        this.requiredKeys = ["signal"];
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(null, this.params.gnd, "5v");
        this.pwm = obniz.getFreePwm();
        this.pwm.start({ io: this.params.signal });
    }
    play(freq) {
        if (typeof freq !== "number") {
            throw new Error("freq must be a number");
        }
        freq = Math.floor(freq); // temporary
        if (freq > 0) {
            this.pwm.freq(freq);
            this.pwm.pulse((1 / freq / 2) * 1000);
        }
        else {
            this.pwm.pulse(0);
        }
    }
    stop() {
        this.play(0);
    }
}
exports.default = Speaker;
//# sourceMappingURL=index.js.map