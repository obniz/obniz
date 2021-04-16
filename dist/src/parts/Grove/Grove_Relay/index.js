"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_Relay
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_Relay {
    constructor() {
        this.keys = ['signal', 'gnd', 'vcc', 'grove'];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: 'Grove_Relay',
        };
    }
    wired(obniz) {
        if (this.params.grove) {
            this.io_signal = this.params.grove.getDigital();
        }
        else {
            this.obniz = obniz;
            obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
            this.io_signal = obniz.getIO(this.params.signal);
        }
        this.off();
    }
    on() {
        this.io_signal.output(true);
    }
    off() {
        this.io_signal.output(false);
    }
}
exports.default = Grove_Relay;
