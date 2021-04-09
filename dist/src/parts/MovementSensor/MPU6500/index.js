"use strict";
/**
 * @packageDocumentation
 * @module Parts.MPU6500
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MPU6050_1 = __importDefault(require("../MPU6050"));
class MPU6500 extends MPU6050_1.default {
    static info() {
        return {
            name: 'MPU6500',
        };
    }
    constructor() {
        super();
        MPU6500.commands.whoami_result = 0x70;
        MPU6500.commands.accel_intel_ctrl = 0x69;
        MPU6500.commands.accel_config2 = 0x1d;
    }
    init() {
        super.init();
        this.obniz.wait(1);
        this.write(MPU6500.commands.accel_config2, 0x00);
    }
}
exports.default = MPU6500;
