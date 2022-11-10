"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS03R
 */
/* eslint rulesdir/non-ascii: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const iBS_1 = __importDefault(require("../utils/abstracts/iBS"));
/** iBS03R management class iBS03Rを管理するクラス */
class iBS03R extends iBS_1.default {
    constructor() {
        super(...arguments);
        this.staticClass = iBS03R;
    }
}
exports.default = iBS03R;
iBS03R.PartsName = 'iBS03R';
iBS03R.BeaconDataStruct = Object.assign({ battery: iBS_1.default.Config.battery, 
    // TODO: delete
    button: iBS_1.default.Config.button, distance: {
        index: 7,
        length: 2,
        type: 'unsignedNumLE',
    }, 
    // TODO: delete
    address: {
        index: 0,
        type: 'custom',
        func: (data, peripheral) => peripheral.address,
    } }, iBS_1.default.getUniqueData(3, 0x13));
