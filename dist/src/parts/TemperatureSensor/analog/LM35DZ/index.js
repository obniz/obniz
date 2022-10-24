"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalogTemperatureSensor_1 = __importDefault(require("../AnalogTemperatureSensor"));
class LM35DZ extends AnalogTemperatureSensor_1.default {
    constructor() {
        super(...arguments);
        this.temperature = 0;
        this.tempArray = new Array(100);
        this.sum = 0;
        this.init_count = 0;
        this.count = 0;
    }
    static info() {
        return {
            name: 'LM35DZ',
        };
    }
    calc(voltage) {
        this.temperature = voltage * 100; // Temp(Celsius) = [AD Voltage] * 100;
        if (this.init_count < 100) {
            // initialization
            this.tempArray[this.init_count] = this.temperature;
            this.sum += this.temperature;
            this.init_count++;
            return this.sum / this.init_count;
        }
        else {
            // moving average
            if (this.count === 100) {
                this.count = 0;
            }
            this.sum -= this.tempArray[this.count]; // remove oldest temperature data
            this.tempArray[this.count] = this.temperature; // overwrite oldest temperature data to newest
            this.sum += this.temperature; // add newest temperature data
            this.count++;
            return this.sum / 100;
        }
    }
}
exports.default = LM35DZ;
