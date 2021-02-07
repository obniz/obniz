"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_PIRMotionSensor
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_PIRMotionSensor {
    constructor() {
        this.isPressed = null;
        this.onchange = null;
        this.onChangeForStateWait = (pressed) => { };
        this.keys = ["signal", "gnd", "vcc", "grove"];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: "Grove_PIRMotionSensor",
        };
    }
    wired(obniz) {
        if (this.params.grove) {
            const groveIOs = this.params.grove.getDigital("5v");
            this.io_signal = groveIOs.primary;
        }
        else {
            this.io_signal = obniz.getIO(this.params.signal);
            obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        }
        this.io_signal.pull("5v");
        this.io_signal.input((value) => {
            this.isPressed = value;
            if (this.onchange) {
                this.onchange(value);
            }
            this.onChangeForStateWait(value);
        });
    }
}
exports.default = Grove_PIRMotionSensor;
