"use strict";
/**
 * @packageDocumentation
 * @module Parts.Button
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Button {
    constructor() {
        this.isPressed = null;
        this.onchange = null;
        this.keys = ['signal', 'gnd', 'pull'];
        this.requiredKeys = ['signal'];
        this.onChangeForStateWait = () => {
            // do nothing.
        };
    }
    static info() {
        return {
            name: 'Button',
        };
    }
    wired(obniz) {
        this.io_signal = obniz.getIO(this.params.signal);
        if (obniz.isValidIO(this.params.gnd)) {
            this.io_supply = obniz.getIO(this.params.gnd);
            this.io_supply.output(false);
        }
        // start input
        if (this.params.pull === '3v') {
            this.io_signal.pull('3v');
        }
        else if (this.params.pull === '0v') {
            this.io_signal.pull('0v');
        }
        else {
            this.io_signal.pull('5v');
        }
        this.io_signal.input((value) => {
            this.isPressed = value === false;
            if (this.onchange) {
                this.onchange(value === false);
            }
            this.onChangeForStateWait(value === false);
        });
    }
    async isPressedWait() {
        const ret = await this.io_signal.inputWait();
        return ret === false;
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
exports.default = Button;
