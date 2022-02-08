"use strict";
/* eslint-disable max-classes-per-file */
/* eslint-disable rulesdir/non-ascii */
/**
 * @packageDocumentation
 * @module ObnizCore
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsInterface_1 = __importDefault(require("./ObnizPartsInterface"));
class ObnizPartsBleInterface extends ObnizPartsInterface_1.default {
    constructor() {
        super(...arguments);
        this.keys = [];
        this.requiredKeys = [];
        this.ioKeys = [];
        /**
         * Internally Used function for connection required devices
         */
        this._peripheral = null;
    }
    wired(obniz) {
        throw new Error(`BLE parts cannot wired`);
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
exports.default = ObnizPartsBleInterface;
