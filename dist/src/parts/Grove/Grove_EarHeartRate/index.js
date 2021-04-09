"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_EarHeartRate
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_EarHeartRate {
    constructor() {
        this.displayIoNames = {
            vcc: 'vcc',
            gnd: 'gnd',
            signal: 'signal',
        };
        this.interval = 5;
        this.duration = 2.5 * 1000;
        this.keys = ['signal', 'gnd', 'vcc', 'grove'];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: 'Grove_EarHeartRate',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        if (this.params.grove) {
            this.signal = this.params.grove.pin1;
            this.params.grove.getDigital('5v');
        }
        else {
            obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
            this.signal = this.params.signal;
        }
    }
    start(callback) {
        this.obniz.logicAnalyzer.start({
            io: this.signal,
            interval: this.interval,
            duration: this.duration,
        });
        this.obniz.logicAnalyzer.onmeasured = (array) => {
            const edges = [];
            for (let i = 0; i < array.length - 1; i++) {
                if (array[i] === 0 && array[i + 1] === 1) {
                    edges.push(i);
                }
            }
            if (edges.length >= 2) {
                let between = 0;
                let pulseMin = 0;
                between = ((edges[1] - edges[0]) * this.interval) / 1000.0;
                pulseMin = 60 / between;
                callback(pulseMin);
            }
        };
    }
    getWait() {
        return new Promise((resolve) => {
            this.start((rate) => {
                resolve(rate);
            });
        });
    }
}
exports.default = Grove_EarHeartRate;
