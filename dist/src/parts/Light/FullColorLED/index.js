"use strict";
/**
 * @packageDocumentation
 * @module Parts.FullColorLED
 */
Object.defineProperty(exports, "__esModule", { value: true });
class FullColorLED {
    constructor() {
        this.COMMON_TYPE_ANODE = 1;
        this.COMMON_TYPE_CATHODE = 0;
        this.anode_keys = ['anode', 'anode_common', 'anodeCommon', 'vcc'];
        this.cathode_keys = ['cathode', 'cathode_common', 'cathodeCommon', 'gnd'];
        this.animationName = 'FullColorLED-' + Math.round(Math.random() * 1000);
        this.keys = ['r', 'g', 'b', 'common', 'commonType'];
        this.requiredKeys = ['r', 'g', 'b', 'common', 'commonType'];
    }
    static info() {
        return {
            name: 'FullColorLED',
        };
    }
    wired(obniz) {
        const r = this.params.r;
        const g = this.params.g;
        const b = this.params.b;
        const common = this.params.common;
        const commontype = this.params.commonType;
        this.obniz = obniz;
        if (this.anode_keys.includes(commontype)) {
            this.commontype = this.COMMON_TYPE_ANODE;
        }
        else if (this.cathode_keys.includes(commontype)) {
            this.commontype = this.COMMON_TYPE_CATHODE;
        }
        else {
            this.obniz.error(new Error('FullColorLED param need common type [  anode_common or cathode_common ] '));
        }
        this.common = this.obniz.getIO(common);
        this.common.output(this.commontype);
        this.obniz.getIO(r).output(this.commontype);
        this.obniz.getIO(g).output(this.commontype);
        this.obniz.getIO(b).output(this.commontype);
        this.pwmR = this.obniz.getFreePwm();
        this.pwmR.start({ io: r });
        this.pwmR.freq(1000);
        this.pwmG = this.obniz.getFreePwm();
        this.pwmG.start({ io: g });
        this.pwmG.freq(1000);
        this.pwmB = this.obniz.getFreePwm();
        this.pwmB.start({ io: b });
        this.pwmB.freq(1000);
        this.rgb(0, 0, 0);
    }
    rgb(red, green, blue) {
        red = Math.min(Math.max(parseInt(red), 0), 255);
        green = Math.min(Math.max(parseInt(green), 0), 255);
        blue = Math.min(Math.max(parseInt(blue), 0), 255);
        if (this.commontype === this.COMMON_TYPE_ANODE) {
            red = 255 - red;
            green = 255 - green;
            blue = 255 - blue;
        }
        this.pwmR.duty((red / 255) * 100);
        this.pwmG.duty((green / 255) * 100);
        this.pwmB.duty((blue / 255) * 100);
    }
    hsv(hue, saturation, value) {
        const C = value * saturation;
        const Hp = hue / 60;
        const X = C * (1 - Math.abs((Hp % 2) - 1));
        let R = 0;
        let G = 0;
        let B = 0;
        if (0 <= Hp && Hp < 1) {
            [R, G, B] = [C, X, 0];
        }
        if (1 <= Hp && Hp < 2) {
            [R, G, B] = [X, C, 0];
        }
        if (2 <= Hp && Hp < 3) {
            [R, G, B] = [0, C, X];
        }
        if (3 <= Hp && Hp < 4) {
            [R, G, B] = [0, X, C];
        }
        if (4 <= Hp && Hp < 5) {
            [R, G, B] = [X, 0, C];
        }
        if (5 <= Hp && Hp < 6) {
            [R, G, B] = [C, 0, X];
        }
        const m = value - C;
        [R, G, B] = [R + m, G + m, B + m];
        R = Math.floor(R * 255);
        G = Math.floor(G * 255);
        B = Math.floor(B * 255);
        this.rgb(R, G, B);
    }
    gradation(cycletime_ms) {
        const frames = [];
        const max = 36 / 2;
        const duration = Math.round(cycletime_ms / max);
        for (let i = 0; i < max; i++) {
            const oneFrame = {
                duration,
                state: (index) => {
                    // index = 0
                    this.hsv(index * 10 * 2, 1, 1);
                },
            };
            frames.push(oneFrame);
        }
        this.obniz.io.animation(this.animationName, 'loop', frames);
    }
    stopgradation() {
        this.obniz.io.animation(this.animationName, 'pause');
    }
}
exports.default = FullColorLED;
