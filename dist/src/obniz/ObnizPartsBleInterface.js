"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore
 */
Object.defineProperty(exports, "__esModule", { value: true });
class ObnizPartsBleInterface {
    static signed16FromBinary(high, low) {
        let val = (high << 8) | low;
        if ((val & 0x8000) !== 0) {
            val = val - 0x10000;
        }
        return val;
    }
}
exports.default = ObnizPartsBleInterface;

//# sourceMappingURL=ObnizPartsBleInterface.js.map
