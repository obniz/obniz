"use strict";
/**
 * @packageDocumentation
 * @module Parts.LED
 */
Object.defineProperty(exports, "__esModule", { value: true });
class LED {
    constructor() {
        this.keys = ['anode', 'cathode'];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: 'LED',
        };
    }
    wired(obniz) {
        const getIO = (io) => {
            if (io && typeof io === 'object') {
                if (typeof io.output === 'function') {
                    return io;
                }
            }
            return obniz.getIO(io);
        };
        this.obniz = obniz;
        if (this.obniz.isValidIO(this.params.anode)) {
            this.io_anode = getIO(this.params.anode);
        }
        if (this.obniz.isValidIO(this.params.cathode)) {
            this.io_cathode = getIO(this.params.cathode);
        }
        this.animationName = 'Led-' + this.params.anode;
        this.off();
    }
    on() {
        this.endBlink();
        this._on();
    }
    off() {
        this.endBlink();
        this._off();
    }
    output(value) {
        if (value) {
            this.on();
        }
        else {
            this.off();
        }
    }
    endBlink() {
        this.obniz.io.animation(this.animationName, 'pause');
    }
    blink(interval) {
        if (!interval) {
            interval = 100;
        }
        const frames = [
            {
                duration: interval,
                state: (index) => {
                    // index = 0
                    this._on(); // on
                },
            },
            {
                duration: interval,
                state: (index) => {
                    // index = 0
                    this._off();
                },
            },
        ];
        this.obniz.io.animation(this.animationName, 'loop', frames);
    }
    _on() {
        if (this.io_anode && this.io_cathode) {
            this.io_anode.output(true);
            this.io_cathode.output(false);
        }
        else if (this.io_anode) {
            this.io_anode.output(true);
        }
        else if (this.io_cathode) {
            this.io_cathode.output(false);
        }
    }
    _off() {
        if (this.io_anode && this.io_cathode) {
            this.io_anode.output(false);
            this.io_cathode.output(false);
        }
        else if (this.io_anode) {
            this.io_anode.output(false);
        }
        else if (this.io_cathode) {
            this.io_cathode.output(true);
        }
    }
}
exports.default = LED;
