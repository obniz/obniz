"use strict";
/* eslint-disable max-classes-per-file */
/* eslint-disable rulesdir/non-ascii */
/**
 * @packageDocumentation
 * @module ObnizCore
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObnizPartsBleInterface = void 0;
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
     * Utility function for reading 4 byte to signed number.
     */
    static signed32FromBinary(byte3, byte2, byte1, byte0) {
        let val = (byte3 << (8 * 3)) | (byte2 << (8 * 2)) | (byte1 << (8 * 1)) | byte0;
        if ((val & 0x80000000) !== 0) {
            val = val - 0x100000000;
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
exports.ObnizPartsBleInterface = ObnizPartsBleInterface;
