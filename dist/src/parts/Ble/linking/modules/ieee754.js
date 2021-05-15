/**
 * @packageDocumentation
 * @module Parts.Linking
 */
/* ------------------------------------------------------------------
 * node-linking - ieee754.js
 *
 * Copyright (c) 2017, Futomi Hatano, All rights reserved.
 * Released under the MIT license
 * Date: 2017-04-13
 * ---------------------------------------------------------------- */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
class LinkingIEEE754 {
    static read(n, slen, elen, flen) {
        const sgn = slen ? (n >>> 11) & 0b1 : 0; // sign
        const max = Math.pow(2, elen) - 1; // maximum of exponent
        const exp = (n >>> flen) & max; // exponent
        let fra = 0; // fraction
        for (let i = 0; i < flen; i++) {
            if ((n >>> (flen - i - 1)) & 0b1) {
                fra += Math.pow(2, -(i + 1));
            }
        }
        if (exp === 0 && fra === 0) {
            return 0;
        }
        else if (exp === 0 && fra !== 0) {
            const m = Math.pow(2, elen - 1) - 1; // median (7 or 15)
            const v = Math.pow(-1, sgn) * fra * Math.pow(2, 1 - m);
            return v;
        }
        else if (exp >= 1 && exp <= max - 1) {
            const m = Math.pow(2, elen - 1) - 1; // median (7 or 15)
            const v = Math.pow(-1, sgn) * (1 + fra) * Math.pow(2, exp - m);
            return v;
        }
        else if (exp === max && fra === 0) {
            return Infinity;
        }
        else {
            return NaN;
        }
    }
}
exports.default = LinkingIEEE754;
