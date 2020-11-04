"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalogTemperatureSensor_1 = __importDefault(require("../AnalogTemperatureSensor"));
class LM35DZ extends AnalogTemperatureSensor_1.default {
    static info() {
        return {
            name: "LM35DZ",
        };
    }
    calc(voltage) {
        return voltage * 100; // Temp(Celsius) = [AD Voltage] * 100l;
    }
}
exports.default = LM35DZ;
