"use strict";
/**
 * @packageDocumentation
 * @module Parts.7SegmentLED
 */
Object.defineProperty(exports, "__esModule", { value: true });
class _7SegmentLED {
    constructor() {
        this.keys = [
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'dp',
            'common',
            'commonType',
        ];
        this.requiredKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        this.digits = [
            0x3f,
            0x06,
            0x5b,
            0x4f,
            0x66,
            0x6d,
            0x7d,
            0x07,
            0x7f,
            0x6f,
            0x6f,
        ];
        this.displayIoNames = {
            a: 'a',
            b: 'b',
            c: 'c',
            d: 'd',
            e: 'e',
            f: 'f',
            g: 'g',
            dp: 'dp',
            common: 'com',
        };
        this.ios = [];
        this.isCathodeCommon = false;
    }
    static info() {
        return {
            name: '7SegmentLED',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.ios = [];
        this.ios.push(this.obniz.getIO(this.params.a));
        this.ios.push(this.obniz.getIO(this.params.b));
        this.ios.push(this.obniz.getIO(this.params.c));
        this.ios.push(this.obniz.getIO(this.params.d));
        this.ios.push(this.obniz.getIO(this.params.e));
        this.ios.push(this.obniz.getIO(this.params.f));
        this.ios.push(this.obniz.getIO(this.params.g));
        this.isCathodeCommon = this.params.commonType === 'anode' ? false : true;
        for (let i = 0; i < this.ios.length; i++) {
            this.ios[i].output(this.isCathodeCommon ? false : true);
        }
        if (this.obniz.isValidIO(this.params.dp)) {
            const dp = this.obniz.getIO(this.params.dp);
            dp.output(false);
            this.dp = dp;
        }
        if (this.obniz.isValidIO(this.params.common)) {
            this.common = this.obniz.getIO(this.params.common);
            this.on();
        }
    }
    print(data) {
        if (typeof data === 'number') {
            data = Math.floor(data);
            data = data % 10;
            for (let i = 0; i < 7; i++) {
                if (this.ios[i]) {
                    let val = this.digits[data] & (1 << i) ? true : false;
                    if (!this.isCathodeCommon) {
                        val = !val;
                    }
                    this.ios[i].output(val);
                }
            }
            this.on();
        }
    }
    printRaw(data) {
        if (typeof data === 'number') {
            for (let i = 0; i < 7; i++) {
                if (this.ios[i]) {
                    let val = data & (1 << i) ? true : false;
                    if (!this.isCathodeCommon) {
                        val = !val;
                    }
                    this.ios[i].output(val);
                }
            }
            this.on();
        }
    }
    dpState(show) {
        if (this.dp) {
            this.dp.output(this.isCathodeCommon ? show : !show);
        }
    }
    on() {
        if (this.common) {
            this.common.output(this.isCathodeCommon ? false : true);
        }
    }
    off() {
        if (this.common) {
            this.common.output(this.isCathodeCommon ? true : false);
        }
    }
}
exports.default = _7SegmentLED;
