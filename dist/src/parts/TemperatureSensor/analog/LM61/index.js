"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalogTemperatureSensor_1 = __importDefault(require("../AnalogTemperatureSensor"));
class LM61 extends AnalogTemperatureSensor_1.default {
    static info() {
        return {
            name: 'LM61',
        };
    }
    calc(voltage) {
        return Math.round((voltage - 0.6) / 0.01); // Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
    }
}
exports.default = LM61;
