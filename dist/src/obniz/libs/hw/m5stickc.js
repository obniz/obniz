"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Hardware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.M5StickC = void 0;
const ObnizDevice_1 = require("../../ObnizDevice");
class M5StickC extends ObnizDevice_1.ObnizDevice {
    constructor(id, options) {
        super(id, options);
    }
    gyroWait() {
        const supportedIMUNameArr = ['MPU6886', 'SH200Q'];
        if (!supportedIMUNameArr.includes(this.imu.constructor.name)) {
            throw new Error(`gyroWait is supported only on M5stickC with ${supportedIMUNameArr.join()}`);
        }
        return this.imu.getGyroWait();
    }
    accelerationWait() {
        const supportedIMUNameArr = ['MPU6886', 'SH200Q'];
        if (!supportedIMUNameArr.includes(this.imu.constructor.name)) {
            throw new Error(`accelerationWait is supported only on M5stickC with ${supportedIMUNameArr.join()}`);
        }
        return this.imu.getAccelWait();
    }
    setupIMUWait(imuName = 'MPU6886') {
        const i2c = this._m5i2c;
        const onerror = i2c.onerror;
        this.imu = this.wired(imuName, { i2c });
        // eslint-disable-next-line
        this.imu._reset = () => {
            // do nothing.
        };
        const p1 = this.imu.whoamiWait();
        const p2 = new Promise((resolve, reject) => {
            i2c.onerror = reject;
        });
        return Promise.race([p1, p2]).then(async (val) => {
            // restore
            i2c.onerror = onerror;
            if (!val) {
                throw new Error(`Cannot find IMU (${imuName}) on this M5StickC`);
            }
            switch (imuName) {
                case 'SH200Q':
                    await this.imu.initWait();
                    break;
                case 'MPU6886':
                    this.imu.init();
                    break;
                default:
                    break;
            }
            return this.imu;
        });
    }
    _beforeOnConnect() {
        super._beforeOnConnect();
        if (this.ir) {
            // already wired parts
            return;
        }
        this.ir = this.wired('InfraredLED', { anode: 9 });
        this.led = this.wired('LED', { cathode: 10 });
        this.buttonA = this.wired('Button', { signal: 37 });
        this.buttonB = this.wired('Button', { signal: 39 });
        const i2cParams = {
            sda: 21,
            scl: 22,
            clock: 100000,
            pull: '3v',
            mode: 'master',
        };
        this._m5i2c = this.i2c1;
        this._m5i2c.start(i2cParams);
        this.axp = this.wired('AXP192', { i2c: this._m5i2c });
        this.led.off();
    }
    _prepareComponents() {
        super._prepareComponents();
        if (this.hw !== 'm5stickc') {
            throw new Error('Obniz.M5StickC only support ObnizOS for M5StickC. Your device is not ObnizOS for M5StickC.');
        }
    }
}
exports.M5StickC = M5StickC;
