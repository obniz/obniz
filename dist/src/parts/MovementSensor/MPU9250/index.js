"use strict";
/**
 * @packageDocumentation
 * @module Parts.MPU9250
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MPU6500_1 = __importDefault(require("../MPU6500"));
class MPU9250 extends MPU6500_1.default {
    constructor() {
        super();
    }
    static info() {
        return {
            name: 'MPU9250',
        };
    }
    wired(obniz) {
        super.wired(obniz);
        this.ak8963 = obniz.wired('AK8963', { i2c: this.i2c });
        this.write(MPU6500_1.default.commands.pwr_mgmt_1, [0x00]); // activate MPU9250
        this.write(MPU6500_1.default.commands.int_pin_cfg, [0x02]); // activate AK8963 (bypass)
        this.write(MPU6500_1.default.commands.config, [0x06]); // activate LPF (search datasheet_p.13)
        this.write(MPU6500_1.default.commands.accel_config2, [0x02]); // accel LPF set.
        // this.mpu6050 = obniz.wired("MPU6050", { i2c: this.i2c });
    }
    init() {
        super.init();
        // this.bypassMagnetometerWait(true);
    }
    setConfig(accel_range, gyro_range, ADC_cycle) {
        super.setConfig(accel_range, gyro_range);
        if (ADC_cycle) {
            this.ak8963.setConfig(ADC_cycle);
        }
    }
    async getAllAdcWait() {
        const data = await super.getAllAdcWait();
        data.compass = await this.getCompassAdcWait();
        return data;
    }
    async getAllWait() {
        const data = await super.getAllWait();
        data.compass = await this.getCompassWait();
        return data;
    }
    async getCompassWait() {
        return await this.ak8963.getWait();
    }
    async getCompassAdcWait() {
        return await this.ak8963.getAdcWait();
    }
    async getCompassArrayWait() {
        return await this.ak8963.getArrayWait();
    }
    async getCompassAdcArrayWait() {
        return await this.ak8963.getAdcArrayWait();
    }
    getCompassUnit() {
        return this.ak8963.getUnit();
    }
    getCompassRange() {
        return this.ak8963.getRange();
    }
    async getMagneticWait() {
        return await this.getCompassWait();
    }
    async getMagneticAdcWait() {
        return await this.getCompassAdcWait();
    }
    async getMagneticArrayWait() {
        return await this.getCompassArrayWait();
    }
    async getMagneticAdcArrayWait() {
        return await this.getCompassAdcArrayWait();
    }
    getMagneticUnit() {
        return this.getCompassUnit();
    }
    getMagneticRange() {
        return this.getCompassRange();
    }
    async _getAK8963Wait() {
        const ST1 = await this.readWait(0x02, 1); // confirm magnet value readable
        if (ST1[0] & 0x01) {
            return await this.ak8963.getWait();
        }
        return {};
    }
}
exports.default = MPU9250;
