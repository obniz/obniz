"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalogTemperatureSensor_1 = __importDefault(require("../AnalogTemperatureSensor"));
class LMT87 extends AnalogTemperatureSensor_1.default {
    static info() {
        return {
            name: 'LMT87',
        };
    }
    calc(voltage) {
        return (voltage * 1000 - 2365) / -13.6 + 20; // 20-50dc;
    }
}
exports.default = LMT87;
