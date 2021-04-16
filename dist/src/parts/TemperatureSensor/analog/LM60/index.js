"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalogTemperatureSensor_1 = __importDefault(require("../AnalogTemperatureSensor"));
class LM60 extends AnalogTemperatureSensor_1.default {
    static info() {
        return {
            name: 'LM60',
        };
    }
    calc(voltage) {
        return Math.round(((voltage - 0.424) / 0.00625) * 10) / 10; // Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg(Offset voltage)])/[Temp coefficient]
    }
}
exports.default = LM60;
