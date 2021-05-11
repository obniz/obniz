"use strict";
/**
 * @packageDocumentation
 * @module Parts.S8120C
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalogTemperatureSensor_1 = __importDefault(require("../AnalogTemperatureSensor"));
class S8120C extends AnalogTemperatureSensor_1.default {
    static info() {
        return {
            name: 'S8120C',
        };
    }
    calc(voltage) {
        return (voltage - 1.474) / -0.0082 + 30; // Temp(Celsius) = (([AD Voltage] - [Output Voltage at 30deg])/[V/deg]) + 30
    }
}
exports.default = S8120C;
