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
Object.defineProperty(exports, "__esModule", { value: true });
class MPU9250 {
    constructor(obniz) {
        this.keys = ["gnd", "vcc", "sda", "scl", "i2c", "address"];
        this.required = [];
    }
    static info() {
        return {
            name: "MPU9250",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this._address = this.params.address || 0x68;
        this.params.clock = 100000;
        this.params.pull = "3v";
        this.params.mode = "master";
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.i2c.write(this._address, [0x6b, 0x00]); // activate MPU9250
        this.i2c.write(this._address, [0x37, 0x02]); // activate AK8963 (bypass)
        this.i2c.write(this._address, [0x1a, 0x06]); // activate LPF (search datasheet_p.13)
        this.i2c.write(this._address, [0x1d, 0x02]); // accel LPF set.
        this.mpu6050 = obniz.wired("MPU6050", { i2c: this.i2c });
        this.ak8963 = obniz.wired("AK8963", { i2c: this.i2c });
    }
    setConfig(accel_range, gyro_range, ADC_cycle) {
        this.mpu6050.setConfig(accel_range, gyro_range);
        this.ak8963.setConfig(ADC_cycle);
    }
    _getAK8963Wait() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.i2c.write(this._address, [0x02]); // request AK8983 data
            const ST1 = yield this.i2c.readWait(this._address, 1); // confirm magnet value readable
            if (ST1 & 0x01) {
                return yield this.ak8963.getWait();
            }
            return {};
        });
    }
    getAllWait() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.mpu6050.getWait();
            data.compass = yield this.ak8963.getWait();
            return data;
        });
    }
    getCompassWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.ak8963.getWait();
        });
    }
    getAccelerometerWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.mpu6050.getWait()).accelerometer;
        });
    }
    getGyroscopeWait() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.mpu6050.getWait()).gyroscope;
        });
    }
}
exports.default = MPU9250;

//# sourceMappingURL=index.js.map
