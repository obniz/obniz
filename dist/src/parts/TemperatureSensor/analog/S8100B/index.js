"use strict";
/**
 * @packageDocumentation
 * @module Parts.S8100B
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalogTemperatureSensor_1 = __importDefault(require("../AnalogTemperatureSensor"));
class S8100B extends AnalogTemperatureSensor_1.default {
    static info() {
        return {
            name: 'S8100B',
        };
    }
    calc(voltage) {
        return 30 + (1.508 - voltage) / -0.08; // Temp(Celsius) =
    }
}
exports.default = S8100B;
