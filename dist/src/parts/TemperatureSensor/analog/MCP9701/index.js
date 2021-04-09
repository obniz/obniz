"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalogTemperatureSensor_1 = __importDefault(require("../AnalogTemperatureSensor"));
class MCP9701 extends AnalogTemperatureSensor_1.default {
    static info() {
        return {
            name: 'MCP9701',
        };
    }
    calc(voltage) {
        return (voltage - 0.4) / 0.0195; // Temp(Celsius) = ([AD Voltage]-[Voltage at 0 deg])/[Temp coefficient]
    }
}
exports.default = MCP9701;
