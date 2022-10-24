"use strict";
/**
 * @packageDocumentation
 * @module Parts.HC-SR04
 */
Object.defineProperty(exports, "__esModule", { value: true });
class HCSR04 {
    constructor() {
        this._unit = 'mm';
        this.reset_alltime = false;
        this.temp = 15;
        this.keys = ['vcc', 'trigger', 'echo', 'gnd'];
        this.requiredKeys = ['vcc', 'trigger', 'echo'];
    }
    static info() {
        return {
            name: 'HC-SR04',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(null, this.params.gnd, '5v');
        this.vccIO = obniz.getIO(this.params.vcc);
        if (obniz.isValidIO(this.params.trigger) === false) {
            throw new Error(`trigger ${this.params.trigger} is invalid io`);
        }
        if (obniz.isValidIO(this.params.echo) === false) {
            throw new Error(`echo ${this.params.echo} is invalid io`);
        }
        this.trigger = this.params.trigger;
        this.echo = this.params.echo;
        this.vccIO.drive('5v');
        this.vccIO.output(true);
        this.obniz.wait(100);
    }
    measure(callback) {
        this.obniz.measure.echo({
            io_pulse: this.trigger,
            io_echo: this.echo,
            pulse: 'positive',
            pulse_width: 0.011,
            measure_edges: 3,
            timeout: (10 / 340) * 1000,
            callback: async (edges) => {
                if (this.reset_alltime) {
                    this.vccIO.output(false);
                    this.obniz.wait(100).catch(() => {
                        // ignore error
                    });
                    this.vccIO.output(true);
                    this.obniz.wait(100).catch(() => {
                        // ignore error
                    });
                }
                let distance;
                for (let i = 0; i < edges.length - 1; i++) {
                    // HCSR04's output of io_echo is initially high when trigger is finshed
                    if (edges[i].edge === true) {
                        const time = (edges[i + 1].timing - edges[i].timing) / 1000; // (1/4000 * 8) + is needed??
                        distance =
                            (time / 2) * 20.055 * Math.sqrt(this.temp + 273.15) * 1000;
                        if (this._unit === 'inch') {
                            distance = distance * 0.0393701;
                        }
                    }
                }
                if (typeof callback === 'function') {
                    callback(distance);
                }
            },
        });
    }
    async measureWait() {
        return new Promise((resolve) => {
            this.measure((distance) => {
                resolve(distance);
            });
        });
    }
    unit(unit) {
        if (unit === 'mm') {
            this._unit = 'mm';
        }
        else if (unit === 'inch') {
            this._unit = 'inch';
        }
        else {
            throw new Error('HCSR04: unknown unit ' + unit);
        }
    }
}
exports.default = HCSR04;
