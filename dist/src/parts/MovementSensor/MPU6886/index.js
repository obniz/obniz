"use strict";
/**
 * @packageDocumentation
 * @module Parts.MPU6886
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MPU6050_1 = __importDefault(require("../MPU6050"));
class MPU6886 extends MPU6050_1.default {
    constructor() {
        super();
        this.i2cinfo = {
            address: 0x68,
            clock: 100000,
            voltage: '3v',
            pull: '3v',
        };
        MPU6050_1.default.commands.accel_intel_ctrl = 0x69;
        MPU6050_1.default.commands.accel_config2 = 0x1d;
        MPU6050_1.default.commands.whoami_result = 0x68;
    }
    static info() {
        return {
            name: 'MPU6886',
        };
    }
    init() {
        super.init();
        this.obniz.wait(1);
        this.write(MPU6050_1.default.commands.accel_config2, 0x00);
    }
    _reset() {
        // do nothing.
    }
}
exports.default = MPU6886;
