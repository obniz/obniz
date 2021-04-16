"use strict";
/**
 * @packageDocumentation
 * @module Parts.ICM20948
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i2cParts_1 = __importDefault(require("../../i2cParts"));
class ICM20948 extends i2cParts_1.default {
    constructor() {
        super();
        this.g = 9.80665;
        this.i2cinfo = {
            address: 0x69,
            clock: 100000,
            voltage: '3v',
            pull: '3v',
        };
        this._ADDR = 0x69;
        this._WHO_AM_I = 0x00;
        this._GYRO_CONFIG = 0x01;
        this._ACCEL_CONFIG = 0x14;
        this._ACCEL_CONFIG2 = 0x15;
        this._INT_PIN_CFG = 0x0f;
        this._ACCEL_XOUT_H = 0x2d;
        this._ACCEL_XOUT_L = 0x2e;
        this._ACCEL_YOUT_H = 0x2f;
        this._ACCEL_YOUT_L = 0x30;
        this._ACCEL_ZOUT_H = 0x31;
        this._ACCEL_ZOUT_L = 0x32;
        this._GYRO_XOUT_H = 0x33;
        this._GYRO_XOUT_L = 0x34;
        this._GYRO_YOUT_H = 0x35;
        this._GYRO_YOUT_L = 0x36;
        this._GYRO_ZOUT_H = 0x37;
        this._GYRO_ZOUT_L = 0x38;
        // #_ACCEL_FS_MASK = const(0b00011000)
        this._ACCEL_FS_SEL_2G = 0b00000000;
        this._ACCEL_FS_SEL_4G = 0b00000010;
        this._ACCEL_FS_SEL_8G = 0b00000100;
        this._ACCEL_FS_SEL_16G = 0b00000110;
        this._ACCEL_SO_2G = 16384; // 1 / 16384 ie. 0.061 mg / digit
        this._ACCEL_SO_4G = 8192; // 1 / 8192 ie. 0.122 mg / digit
        this._ACCEL_SO_8G = 4096; // 1 / 4096 ie. 0.244 mg / digit
        this._ACCEL_SO_16G = 2048; // 1 / 2048 ie. 0.488 mg / digit
        this._GYRO_FS_MASK = 0b00000110;
        this._GYRO_FS_SEL_250DPS = 0b00110001;
        this._GYRO_FS_SEL_500DPS = 0b00110011;
        this._GYRO_FS_SEL_1000DPS = 0b00110101;
        this._GYRO_FS_SEL_2000DPS = 0b00110111;
        this._GYRO_SO_250DPS = 131;
        this._GYRO_SO_500DPS = 62.5;
        this._GYRO_SO_1000DPS = 32.8;
        this._GYRO_SO_2000DPS = 16.4;
        // # Used for enablind and disabling the i2c bypass access
        this._I2C_BYPASS_MASK = 0b00000010;
        this._I2C_BYPASS_EN = 0b00000010;
        this._I2C_BYPASS_DIS = 0b00000000;
        this._SF_G = 1; //    g
        this._SF_MG = 1000; //    mg
        this._SF_M_S2 = 9.80665; // 1 g = 9.80665 m/s2 ie. standard gravity
        this._SF_DEG_S = 1; // deg / s
        this._SF_RAD_S = 57.295779578552; // 1 rad / s is 57.295779578552 deg / s;
        this._accel_sf = this._SF_M_S2;
        this._accel_so = this._ACCEL_SO_2G;
        this._gyro_sf = this._SF_DEG_S;
        this._gyro_so = this._GYRO_SO_250DPS;
    }
    static info() {
        return {
            name: 'ICM20948',
        };
    }
    wired(obniz) {
        super.wired(obniz);
        this._accel_so = this._accelFs(this._ACCEL_FS_SEL_2G);
        this._gyro_so = this._gyroFs(this._GYRO_FS_SEL_250DPS);
    }
    async initWait() {
        const data = await this.whoamiWait();
        if (data !== 0xea) {
            throw new Error('ICM20948 not found in I2C bus.');
        }
        this.write(0x06, [0x01]); // wake;
        this.write(0x0f, [0x02]); // passthrough;
        this.write(0x03, [0x00]);
        // this.write(12, 0x31, [0x00]);  // power down mode
        // const buf3 = await this._studuinoI2C.readFromMem(12, 0x60, 3);
        this._ak09916 = this.obniz.wired('AK09916', { i2c: this.i2c });
    }
    accelFs(value) {
        if (value === '2g') {
            this._accel_so = this._accelFs(this._ACCEL_FS_SEL_2G);
        }
        else if (value === '4g') {
            this._accel_so = this._accelFs(this._ACCEL_FS_SEL_4G);
        }
        else if (value === '8g') {
            this._accel_so = this._accelFs(this._ACCEL_FS_SEL_8G);
        }
        else if (value === '16g') {
            this._accel_so = this._accelFs(this._ACCEL_FS_SEL_16G);
        }
        else {
            throw new Error("must be '2g'/'4g'/'8g'/'16g'");
        }
    }
    accelSf(value) {
        if (value === 'g') {
            this._accel_sf = this._SF_G;
        }
        else if (value === 'mg') {
            this._accel_sf = this._SF_MG;
        }
        else if (value === 'ms2') {
            this._accel_sf = this._SF_M_S2;
        }
        else {
            throw new Error("must be 'g'/'mg'/'ms2'");
        }
    }
    async accelerationWait() {
        /*
        Acceleration measured by the sensor. By default will return a
        3-tuple of X, Y, Z axis accelerationWait values in mG as integer.
        */
        const so = this._accel_so;
        const sf = this._accel_sf;
        const xyz = await this.readThreeInt16Wait(this._ACCEL_XOUT_H);
        return xyz.map((e) => (e / so) * sf);
    }
    async gyroWait() {
        // """
        // X, Y, Z radians per second as floats.
        // """
        const so = this._gyro_so;
        const sf = this._gyro_sf;
        const xyz = await this.readThreeInt16Wait(this._GYRO_XOUT_H);
        return xyz.map((e) => (e / so) * sf);
    }
    async magneticWait() {
        return this._ak09916.magnetic();
    }
    async calibrateWait() {
        return await this._ak09916.calibrateWait();
    }
    async whoamiWait() {
        // Value of the whoamiWait register. """
        const result = await this.readWait(this._WHO_AM_I, 1);
        return result[0];
    }
    gyroFs(value) {
        if (value === '250dps') {
            this._gyro_so = this._gyroFs(this._GYRO_FS_SEL_250DPS);
        }
        else if (value === '500dps') {
            this._gyro_so = this._gyroFs(this._GYRO_FS_SEL_500DPS);
        }
        else if (value === '1000dps') {
            this._gyro_so = this._gyroFs(this._GYRO_FS_SEL_1000DPS);
        }
        else if (value === '2000dps') {
            this._gyro_so = this._gyroFs(this._GYRO_FS_SEL_2000DPS);
        }
        else {
            throw new Error("must be '250dps'/'500dps'/'1000dps'/'2000dps'");
        }
    }
    gyroSf(value) {
        if (value === 'dps') {
            this._gyro_sf = this._SF_DEG_S;
        }
        else if (value === 'rps') {
            this._gyro_sf = this._SF_RAD_S;
        }
        else {
            throw new Error("must be 'dps'/'rps'");
        }
    }
    async _gyroDlpfWait(dlpfcfg = -1) {
        this.write(0x7f, [0x20]);
        // # get ICM20948 gyroWait configuration.
        let char = (await this.readWait(this._GYRO_CONFIG, 1))[0];
        char &= this._GYRO_FS_MASK; // clear DLDF bits
        if (dlpfcfg === -1) {
            char |= 0x00000000;
        }
        else if (dlpfcfg === 0) {
            char |= 0x00000001;
        }
        else if (dlpfcfg === 1) {
            char |= 0x00001001;
        }
        else if (dlpfcfg === 2) {
            char |= 0x00010001;
        }
        else if (dlpfcfg === 3) {
            char |= 0x00011001;
        }
        else if (dlpfcfg === 4) {
            char |= 0x00100001;
        }
        else if (dlpfcfg === 5) {
            char |= 0x00101001;
        }
        else if (dlpfcfg === 6) {
            char |= 0x00110001;
        }
        else if (dlpfcfg === 7) {
            char |= 0x00111001;
        }
        else {
            char |= 0x00000000;
        }
        this.write(this._GYRO_CONFIG, [char]);
        this.write(0x7f, [0x00]);
    }
    _accelFs(value) {
        this.write(0x7f, [0x20]);
        this.write(this._ACCEL_CONFIG, [value]);
        this.write(0x7f, [0x00]);
        // # Return the sensitivity divider
        if (this._ACCEL_FS_SEL_2G === value) {
            return this._ACCEL_SO_2G;
        }
        else if (this._ACCEL_FS_SEL_4G === value) {
            return this._ACCEL_SO_4G;
        }
        else if (this._ACCEL_FS_SEL_8G === value) {
            return this._ACCEL_SO_8G;
        }
        else if (this._ACCEL_FS_SEL_16G === value) {
            return this._ACCEL_SO_16G;
        }
        return 0;
    }
    _gyroFs(value) {
        this.write(0x7f, [0x20]);
        this.write(this._GYRO_CONFIG, [value]);
        this.write(0x7f, [0x00]);
        // # Return the sensitivity divider
        if (this._GYRO_FS_SEL_250DPS === value) {
            return this._GYRO_SO_250DPS;
        }
        else if (this._GYRO_FS_SEL_500DPS === value) {
            return this._GYRO_SO_500DPS;
        }
        else if (this._GYRO_FS_SEL_1000DPS === value) {
            return this._GYRO_SO_1000DPS;
        }
        else if (this._GYRO_FS_SEL_2000DPS === value) {
            return this._GYRO_SO_2000DPS;
        }
        return 0;
    }
}
exports.default = ICM20948;
