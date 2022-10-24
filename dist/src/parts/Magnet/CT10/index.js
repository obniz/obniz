"use strict";
/**
 * @packageDocumentation
 * @module Parts.CT10
 */
Object.defineProperty(exports, "__esModule", { value: true });
class CT10 {
    constructor() {
        this.isNear = null;
        this.onchange = null;
        this.keys = ['signal', 'gnd', 'vcc'];
        this.requiredKeys = ['signal'];
        this.onChangeForStateWait = () => {
            // do nothing.
        };
    }
    static info() {
        return {
            name: 'CT10',
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
        this.io_signal.pull('0v');
        this.io_signal.input((value) => {
            this.isNear = value;
            if (this.onchange) {
                this.onchange(value);
            }
            this.onChangeForStateWait(value);
        });
    }
    async isNearWait() {
        return await this.io_signal.inputWait();
    }
    stateWait(isNear) {
        return new Promise((resolve) => {
            this.onChangeForStateWait = (near) => {
                if (isNear === near) {
                    this.onChangeForStateWait = () => {
                        // do nothing.
                    };
                    resolve();
                }
            };
        });
    }
}
exports.default = CT10;
