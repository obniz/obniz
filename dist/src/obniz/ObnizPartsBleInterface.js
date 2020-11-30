"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ObnizPartsBleInterface {
    constructor() {
        /**
         * Internally Used function for connection required devices
         */
        this._peripheral = null;
    }
    /**
     * Utility function for reading 2 byte to signed number.
     */
    static signed16FromBinary(high, low) {
        let val = (high << 8) | low;
        if ((val & 0x8000) !== 0) {
            val = val - 0x10000;
        }
        return val;
    }
    /**
     * Utility function for reading 1byte fixed point number
     */
    static readFraction(byte) {
        let result = 0;
        let mask = 0b10000000;
        let num = 0.5;
        for (let i = 0; i < 8; i++) {
            if (byte & mask) {
                result += num;
            }
            num /= 2.0;
            mask >>= 1;
        }
        return result;
    }
}
exports.default = ObnizPartsBleInterface;
