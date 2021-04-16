"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class USB {
    constructor() {
        this.keys = ['vcc', 'gnd'];
        this.requiredKeys = ['vcc', 'gnd'];
        this.displayIoNames = {
            vcc: 'vcc',
            gnd: 'gnd',
        };
    }
    static info() {
        return {
            name: 'USB',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.io_vdd = obniz.getIO(this.params.vcc);
        this.io_gnd = obniz.getIO(this.params.gnd);
        this.io_gnd.output(false);
    }
    on() {
        this.io_vdd.output(true);
    }
    off() {
        this.io_vdd.output(false);
    }
}
exports.default = USB;
