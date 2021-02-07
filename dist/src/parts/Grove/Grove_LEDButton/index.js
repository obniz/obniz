"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_LEDButton
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_LEDButton {
    constructor() {
        this.isPressed = null;
        this.onchange = null;
        this.onChangeForStateWait = (pressed) => { };
        this.keys = ["signal2", "signal1", "gnd", "vcc", "grove"];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: "Grove_LEDButton",
        };
    }
    wired(obniz) {
        if (this.params.grove) {
            this.pmw_led = this.params.grove.getPwm();
        }
        else {
            this.obniz = obniz;
            obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
            this.pmw_led = obniz.getFreePwm();
            this.pmw_led.start({ io: this.params.signal1 });
            this.pmw_led.freq(490);
            this.io_button = obniz.getIO(this.params.signal2);
            this.io_button.input((value) => {
                const pressed = !value;
                this.isPressed = pressed;
                if (this.onchange) {
                    this.onchange(pressed);
                }
                this.onChangeForStateWait(pressed);
            });
            this.setLEDBrightness(0);
        }
    }
    setLEDBrightness(percent) {
        if (typeof percent !== "number") {
            throw new Error("freq must be a number");
        }
        this.pmw_led.duty(percent);
    }
    async isPressedWait() {
        return await this.io_button.inputWait();
    }
    stateWait(isPressed) {
        return new Promise((resolve, reject) => {
            this.onChangeForStateWait = (pressed) => {
                if (isPressed === pressed) {
                    this.onChangeForStateWait = () => { };
                    resolve();
                }
            };
        });
    }
}
exports.default = Grove_LEDButton;
