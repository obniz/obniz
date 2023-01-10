"use strict";
/**
 * @packageDocumentation
 * @module Parts.7SegmentLEDArray
 */
Object.defineProperty(exports, "__esModule", { value: true });
class _7SegmentLEDArray {
    constructor() {
        this.identifier = '' + new Date().getTime();
        this.keys = ['segments'];
        this.requiredKeys = this.keys;
    }
    static info() {
        return {
            name: '7SegmentLEDArray',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.segments = this.params.segments;
    }
    print(data) {
        if (typeof data === 'number') {
            data = Math.floor(data);
            const print = (index) => {
                let val = data;
                for (let i = 0; i < this.segments.length; i++) {
                    if (index === i) {
                        this.segments[i].print(val % 10);
                    }
                    else {
                        this.segments[i].off();
                    }
                    val = val / 10;
                }
            };
            const animations = [];
            for (let i = 0; i < this.segments.length; i++) {
                animations.push({
                    duration: 3,
                    state: print,
                });
            }
            this.obniz.io.animation(this.identifier, 'loop', animations);
        }
    }
    on() {
        this.obniz.io.animation(this.identifier, 'resume');
    }
    off() {
        this.obniz.io.animation(this.identifier, 'pause');
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].off();
        }
    }
}
exports.default = _7SegmentLEDArray;
