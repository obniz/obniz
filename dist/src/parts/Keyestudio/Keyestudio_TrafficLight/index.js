"use strict";
/**
 * @packageDocumentation
 * @module Parts.Keyestudio_TrafficLight
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Keyestudio_TrafficLight {
    constructor() {
        this.keys = ['gnd', 'green', 'yellow', 'red'];
        this.requiredKeys = ['green', 'yellow', 'red'];
        this.state = 'red';
    }
    static info() {
        return {
            name: 'Keyestudio_TrafficLight',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(null, this.params.gnd, '5v');
        this.green = obniz.wired('LED', { anode: this.params.green });
        this.yellow = obniz.wired('LED', { anode: this.params.yellow });
        this.red = obniz.wired('LED', { anode: this.params.red });
    }
    single(led) {
        this.green.off();
        this.yellow.off();
        this.red.off();
        this.state = led;
        switch (led) {
            case 'green':
                this.green.on();
                break;
            case 'yellow':
                this.yellow.on();
                break;
            case 'red':
            default:
                this.red.on();
                this.state = 'red';
                break;
        }
    }
    next() {
        switch (this.state) {
            case 'green':
                this.single('yellow');
                break;
            case 'yellow':
                this.single('red');
                break;
            case 'red':
            default:
                this.single('green');
                break;
        }
    }
}
exports.default = Keyestudio_TrafficLight;
