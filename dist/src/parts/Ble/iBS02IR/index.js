"use strict";
/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */
/* eslint rulesdir/non-ascii: 0 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ingics_1 = __importDefault(require("./ingics"));
const ranger_1 = __importDefault(require("./ranger"));
const ObnizPartsBleInterface_1 = require("../../../obniz/ObnizPartsBleInterface");
/** iBS02IR management class iBS02IRを管理するクラス */
class iBS02IR extends ObnizPartsBleInterface_1.ObnizPartsBleInterface {
    static info() {
        return {
            name: 'iBS02IR',
        };
    }
    static isDevice(peripheral) {
        return (ingics_1.default.isDevice(peripheral) || ranger_1.default.isDevice(peripheral));
    }
    static isDeviceWithMode(peripheral, mode) {
        return (ingics_1.default.isDeviceWithMode(peripheral, mode) ||
            ranger_1.default.isDeviceWithMode(peripheral, mode));
    }
    static getData(peripheral) {
        var _a, _b;
        return ((_b = (_a = ingics_1.default.getData(peripheral)) !== null && _a !== void 0 ? _a : ranger_1.default.getData(peripheral)) !== null && _b !== void 0 ? _b : null);
    }
    static getManufacturer(peripheral) {
        if (ingics_1.default.getData(peripheral)) {
            return 'ingics';
        }
        if (ranger_1.default.getData(peripheral)) {
            return 'ranger';
        }
        return null;
    }
}
exports.default = iBS02IR;
