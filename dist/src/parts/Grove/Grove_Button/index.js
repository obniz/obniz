"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_Button
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_Button {
    constructor() {
        this.isPressed = null;
        this.onchange = null;
        this.onChangeForStateWait = (pressed) => {
            // do nothing.
        };
        this.keys = ['signal', 'gnd', 'vcc', 'grove'];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: 'Grove_Button',
        };
    }
    wired(obniz) {
        if (this.params.grove) {
            const groveIOs = this.params.grove.getDigital('5v');
            this.io_signal = groveIOs.primary;
        }
        else {
            this.io_signal = obniz.getIO(this.params.signal);
            obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
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
exports.default = Grove_Button;
