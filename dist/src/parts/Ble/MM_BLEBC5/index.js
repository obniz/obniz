"use strict";
/**
 * @packageDocumentation
 * @module Parts.MM_BLEBC5
 */
/* eslint rulesdir/non-ascii: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MINEW_1 = __importDefault(require("../utils/abstracts/MINEW"));
/**
 * ACC Slot Only
 */
class MM_BLEBC5 extends MINEW_1.default {
    constructor() {
        super(...arguments);
        this.staticClass = MM_BLEBC5;
    }
}
exports.default = MM_BLEBC5;
MM_BLEBC5.PartsName = 'MM_BLEBC5';
MM_BLEBC5.ServiceDataLength = 18;
MM_BLEBC5.ServiceDataStruct = MINEW_1.default.getServiceDataStruct(9, 3, {
    // TODO: delete (abstract)
    battery: {
        index: 2,
        type: 'unsignedNumBE',
    },
    acceleration: {
        index: 3,
        length: 6,
        type: 'xyz',
        fixedIntegerBytes: 1,
        round: 2,
    },
});
