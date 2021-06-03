"use strict";
/**
 * @packageDocumentation
 * @module Parts.Keyestudio_Button
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Keyestudio_Button {
    constructor() {
        this.isPressed = null;
        this.onchange = null;
        this.onChangeForStateWait = (pressed) => {
            // do nothing.
        };
        this.keys = ['signal', 'gnd', 'vcc'];
        this.requiredKeys = ['signal'];
    }
    static info() {
        return {
            name: 'Keyestudio_Button',
        };
    }
    wired(obniz) {
        this.io_signal = obniz.getIO(this.params.signal);
        if (obniz.isValidIO(this.params.vcc)) {
            this.io_vcc = obniz.getIO(this.params.vcc);
            this.io_vcc.output(true);
        }
        if (obniz.isValidIO(this.params.gnd)) {
            this.io_supply = obniz.getIO(this.params.gnd);
            this.io_supply.output(false);
        }
        this.io_signal.pull('5v');
        this.io_signal.input((value) => {
            this.isPressed = value;
            if (this.onchange) {
                this.onchange(value);
            }
            this.onChangeForStateWait(value);
        });
    }
    async isPressedWait() {
        return await this.io_signal.inputWait();
    }
    stateWait(isPressed) {
        return new Promise((resolve, reject) => {
            this.onChangeForStateWait = (pressed) => {
                if (isPressed === pressed) {
                    this.onChangeForStateWait = () => {
                        // do nothing.
                    };
                    resolve();
                }
            };
        });
    }
}
exports.default = Keyestudio_Button;
