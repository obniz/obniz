"use strict";
/**
 * @packageDocumentation
 * @module Parts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i2cParts_1 = __importDefault(require("./i2cParts"));
class I2cImu6Abstract extends i2cParts_1.default {
    constructor() {
        super(...arguments);
        this.accel_so = '2g';
        this.gyro_so = '250dps';
        this.accel_sf = 'g';
        this.gyro_sf = 'dps';
    }
    static _accelS(value, accel_so, accel_sf) {
        return ((value / I2cImu6Abstract.scales.accel.so[accel_so]) *
            I2cImu6Abstract.scales.accel.sf[accel_sf]);
    }
    static _gyroS(value, gyro_so, gyro_sf) {
        return ((value / I2cImu6Abstract.scales.gyro.so[gyro_so]) *
            I2cImu6Abstract.scales.gyro.sf[gyro_sf]);
    }
    async getAccelWait() {
        const adc = await this.getAccelAdcWait();
        return this.calcAccel(adc);
    }
    async getGyroWait() {
        const adc = await this.getGyroAdcWait();
        return this.calcGyro(adc);
    }
    async getTempWait() {
        const adc = await this.getTempAdcWait();
        return this.calcTemp(adc);
    }
    async getAllWait() {
        const adc = await this.getAllAdcWait();
        const ret = {
            accelerometer: this.calcAccel(adc.accelerometer),
            gyroscope: this.calcGyro(adc.gyroscope),
            temperature: this.calcTemp(adc.temperature),
        };
        if ('compass' in adc) {
            ret.compass = adc.compass;
        }
        return ret;
    }
    async getAccelArrayWait() {
        const obj = await this.getAccelWait();
        return [obj.x, obj.y, obj.z];
    }
    async getGyroArrayWait() {
        const obj = await this.getGyroWait();
        return [obj.x, obj.y, obj.z];
    }
    async getAllArrayWait() {
        const obj = await this.getAllWait();
        return [
            [obj.accelerometer.x, obj.accelerometer.y, obj.accelerometer.z],
            [obj.gyroscope.x, obj.gyroscope.y, obj.gyroscope.z],
        ];
    }
    async getAccelAdcArrayWait() {
        const obj = await this.getAccelAdcWait();
        return [obj.x, obj.y, obj.z];
    }
    async getGyroAdcArrayWait() {
        const obj = await this.getGyroAdcWait();
        return [obj.x, obj.y, obj.z];
    }
    async getAllAdcArrayWait() {
        const obj = await this.getAllAdcWait();
        return [
            [obj.accelerometer.x, obj.accelerometer.y, obj.accelerometer.z],
            [obj.gyroscope.x, obj.gyroscope.y, obj.gyroscope.z],
        ];
    }
    async getAccelerometerWait() {
        return await this.getAccelWait();
    }
    async getGyroscopeWait() {
        return await this.getGyroWait();
    }
    async getWait() {
        return await this.getAllWait();
    }
    async getAllDataWait() {
        return await this.getAllWait();
    }
    getAccelRange() {
        return this.accel_so;
    }
    getGyroRange() {
        return this.gyro_so;
    }
    getAccelUnit() {
        return this.accel_sf;
    }
    getGyroUnit() {
        return this.gyro_sf;
    }
    setAccelUnit(accel_unit) {
        if (accel_unit in I2cImu6Abstract.scales.accel.sf) {
            this.accel_sf = accel_unit;
        }
        else {
            throw new Error(`Invalid accel unit. Valid values are: ${Object.keys(I2cImu6Abstract.scales.accel.sf).join()}`);
        }
    }
    setGyroUnit(gyro_unit) {
        if (gyro_unit in I2cImu6Abstract.scales.gyro.sf) {
            this.gyro_sf = gyro_unit;
        }
        else {
            throw new Error(`Invalid gyro unit. Valid values are: ${Object.keys(I2cImu6Abstract.scales.gyro.sf).join()}`);
        }
    }
    calcAccel(adc) {
        return {
            x: I2cImu6Abstract._accelS(adc.x, this.accel_so, this.accel_sf),
            y: I2cImu6Abstract._accelS(adc.y, this.accel_so, this.accel_sf),
            z: I2cImu6Abstract._accelS(adc.z, this.accel_so, this.accel_sf),
        };
    }
    calcGyro(adc) {
        return {
            x: I2cImu6Abstract._gyroS(adc.x, this.gyro_so, this.gyro_sf),
            y: I2cImu6Abstract._gyroS(adc.y, this.gyro_so, this.gyro_sf),
            z: I2cImu6Abstract._gyroS(adc.z, this.gyro_so, this.gyro_sf),
        };
    }
}
exports.default = I2cImu6Abstract;
// d/so*sf
I2cImu6Abstract.scales = {
    accel: {
        so: {
            '2g': 16384,
            '4g': 8192,
            '8g': 4096,
            '16g': 2048, // 1 / 2048 ie. 0.488 mg / digit
        },
        sf: {
            m_s2: 9.80665,
            g: 1,
            mg: 1000,
        },
    },
    gyro: {
        so: {
            '125dps': 262.144,
            '250dps': 131.072,
            '500dps': 65.536,
            '1000dps': 32.768,
            '2000dps': 16.384,
        },
        sf: {
            dps: 1,
            rps: 0.01745329251, // 1 rad/s is 57.295779578552 deg/s
        },
    },
};
