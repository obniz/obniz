"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i2cParts_1 = __importDefault(require("./i2cParts"));
class I2cImu6Abstract extends i2cParts_1.default {
    constructor() {
        super(...arguments);
        this.accel_so = "2g";
        this.gyro_so = "250dps";
        this.accel_sf = "g";
        this.gyro_sf = "dps";
    }
    static _accelS(value, accel_so, accel_sf) {
        return value / I2cImu6Abstract.scales.accel.so[accel_so] * I2cImu6Abstract.scales.accel.sf[accel_sf];
    }
    static _gyroS(value, gyro_so, gyro_sf) {
        return value / I2cImu6Abstract.scales.gyro.so[gyro_so] * I2cImu6Abstract.scales.gyro.sf[gyro_sf];
    }
    getAccelWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const adc = yield this.getAccelAdcWait();
            return this.calcAccel(adc);
        });
    }
    getGyroWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const adc = yield this.getGyroAdcWait();
            return this.calcGyro(adc);
        });
    }
    getTempWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const adc = yield this.getTempAdcWait();
            return this.calcTemp(adc);
        });
    }
    getAllWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const adc = yield this.getAllAdcWait();
            const ret = {
                accelerometer: this.calcAccel(adc.accelerometer),
                gyroscope: this.calcGyro(adc.gyroscope),
                temperature: this.calcTemp(adc.temperature),
            };
            if ("compass" in adc) {
                ret.compass = adc.compass;
            }
            return ret;
        });
    }
    getAccelArrayWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield this.getAccelWait();
            return [obj.x, obj.y, obj.z];
        });
    }
    getGyroArrayWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield this.getGyroWait();
            return [obj.x, obj.y, obj.z];
        });
    }
    getAllArrayWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield this.getAllWait();
            return [
                [obj.accelerometer.x, obj.accelerometer.y, obj.accelerometer.z],
                [obj.gyroscope.x, obj.gyroscope.y, obj.gyroscope.z],
            ];
        });
    }
    getAccelAdcArrayWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield this.getAccelAdcWait();
            return [obj.x, obj.y, obj.z];
        });
    }
    getGyroAdcArrayWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield this.getGyroAdcWait();
            return [obj.x, obj.y, obj.z];
        });
    }
    getAllAdcArrayWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield this.getAllAdcWait();
            return [
                [obj.accelerometer.x, obj.accelerometer.y, obj.accelerometer.z],
                [obj.gyroscope.x, obj.gyroscope.y, obj.gyroscope.z],
            ];
        });
    }
    getAccelerometerWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAccelWait();
        });
    }
    getGyroscopeWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getGyroWait();
        });
    }
    getWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAllWait();
        });
    }
    getAllDataWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getAllWait();
        });
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
            "2g": 16384,
            "4g": 8192,
            "8g": 4096,
            "16g": 2048,
        },
        sf: {
            m_s2: 9.80665,
            g: 1,
            mg: 1000,
        },
    },
    gyro: {
        so: {
            "125dps": 262.144,
            "250dps": 131.072,
            "500dps": 65.536,
            "1000dps": 32.768,
            "2000dps": 16.384,
        },
        sf: {
            dps: 1,
            rps: 0.01745329251,
        },
    },
};

//# sourceMappingURL=i2cImu6.js.map
