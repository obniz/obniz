"use strict";
/**
 * @packageDocumentation
 * @module Parts.BMP280
 */
Object.defineProperty(exports, "__esModule", { value: true });
class BMP280 {
    constructor() {
        this.requiredKeys = [];
        this.keys = [
            'vcore',
            'vio',
            'gnd',
            'csb',
            'sdi',
            'sck',
            'sdo',
            'i2c',
            'address',
        ];
        this.ioKeys = ['vcore', 'vio', 'gnd', 'csb', 'sdi', 'sdo', 'sck'];
        this.configration = {
            sampling: {
                temp: 1,
                pres: 1,
            },
            interval: 5,
            iir_strength: 0,
            mode: 3,
            Modes: {
                sleep: 0,
                forced: 1,
                normal: 3,
            },
        };
        this.commands = {};
        this.commands.addresses = {
            config: 0xf5,
            ctrl_meas: 0xf4,
        };
    }
    static info() {
        return {
            name: 'BMP280',
            datasheet: 'https://www.bosch-sensortec.com/media/boschsensortec/downloads/datasheets/bst-bmp280-ds001.pdf',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        if (obniz.isValidIO(this.params.csb)) {
            // selecting I2C mode before powerup
            this.io_csb = obniz.getIO(this.params.csb);
            this.io_csb.drive('3v');
            this.io_csb.output(true);
        }
        this.obniz.setVccGnd(this.params.vio, null, '3v');
        this.obniz.setVccGnd(this.params.vcore, null, '3v');
        this.obniz.setVccGnd(null, this.params.gnd, '5v');
        this.obniz.wait(10);
        this.address = 0x76;
        if (this.params.address === 0x76) {
            this.address = 0x76;
        }
        else if (this.params.address === 0x77) {
            this.address = 0x77;
        }
        else if (this.params.address !== undefined) {
            throw new Error('address must be 0x76 or 0x77');
        }
        if (obniz.isValidIO(this.params.sdo)) {
            this.io_sdo = obniz.getIO(this.params.sdo);
            this.io_sdo.drive('3v');
            this.io_sdo.output(this.address === 0x76 ? false : true);
        }
        this.params.sda = this.params.sda || this.params.sdi;
        this.params.scl = this.params.scl || this.params.sck;
        this.params.clock = this.params.clock || 100 * 1000;
        this.params.mode = 'master';
        this.params.pull = '3v';
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.obniz.wait(10);
        this.config();
        this.obniz.wait(10);
    }
    /**
     * @deprecated
     * @param strength
     */
    setIIRStrength(strength) {
        return this.setIIRStrengthWait(strength);
    }
    async setIIRStrengthWait(strengh) {
        this.configration.iir_strength = strengh;
        await this.configWait();
    }
    /**
     * @deprecated
     */
    applyCalibration() {
        return this.applyCalibrationWait();
    }
    async applyCalibrationWait() {
        this.i2c.write(this.address, [0x88]);
        const data = await this.i2c.readWait(this.address, 24);
        this._calibrated = {
            dig_T1: (data[1] << 8) | data[0],
            dig_T2: this._readSigned16((data[3] << 8) | data[2]),
            dig_T3: this._readSigned16((data[5] << 8) | data[4]),
            dig_P1: (data[7] << 8) | data[6],
            dig_P2: this._readSigned16((data[9] << 8) | data[8]),
            dig_P3: this._readSigned16((data[11] << 8) | data[10]),
            dig_P4: this._readSigned16((data[13] << 8) | data[12]),
            dig_P5: this._readSigned16((data[15] << 8) | data[14]),
            dig_P6: this._readSigned16((data[17] << 8) | data[16]),
            dig_P7: this._readSigned16((data[19] << 8) | data[18]),
            dig_P8: this._readSigned16((data[21] << 8) | data[20]),
            dig_P9: this._readSigned16((data[23] << 8) | data[22]),
        };
        this._t_fine = 0;
    }
    async getAllWait() {
        const data = await this.getData();
        const press_raw = (data[0] << 12) | (data[1] << 4) | (data[2] >> 4);
        const temp_raw = (data[3] << 12) | (data[4] << 4) | (data[5] >> 4);
        const temperature = this.calibration_T(temp_raw) / 100.0;
        const pressure = this.calibration_P(press_raw) / 100.0;
        return { temperature, pressure };
    }
    async getTempWait() {
        return (await this.getAllWait()).temperature;
    }
    async getPressureWait() {
        return (await this.getAllWait()).pressure;
    }
    async getAltitudeWait() {
        const pressure = await this.getPressureWait();
        return this.calcAltitude(pressure);
    }
    calcAltitude(pressure, seaPressure) {
        if (typeof seaPressure !== 'number') {
            seaPressure = 1013.25;
        }
        return ((1.0 - Math.pow(pressure / seaPressure, 1 / 5.2553)) * 145366.45 * 0.3048);
    }
    /**
     * @deprecated
     * @private
     */
    config() {
        return this.configWait();
    }
    async configWait() {
        this.write([
            this.commands.addresses.config,
            (this.configration.interval << 5) |
                (this.configration.iir_strength << 2) |
                0,
        ]);
        this.write([
            this.commands.addresses.ctrl_meas,
            (this.configration.sampling.temp << 5) |
                (this.configration.sampling.pres << 2) |
                this.configration.mode,
        ]);
    }
    _readSigned16(value) {
        if (value >= 0x8000) {
            value = value - 0x10000;
        }
        return value;
    }
    _readSigned8(value) {
        if (value >= 0x80) {
            value = value - 0x100;
        }
        return value;
    }
    write(data) {
        this.i2c.write(this.address, data);
    }
    getData() {
        return this.getDataWait();
    }
    async getDataWait() {
        this.i2c.write(this.address, [0xf7]);
        return await this.i2c.readWait(this.address, 6);
    }
    calibration_T(adc_T) {
        const var1 = (((adc_T >> 3) - (this._calibrated.dig_T1 << 1)) *
            this._calibrated.dig_T2) >>
            11;
        const var2 = (((((adc_T >> 4) - this._calibrated.dig_T1) *
            ((adc_T >> 4) - this._calibrated.dig_T1)) >>
            12) *
            this._calibrated.dig_T3) >>
            14;
        this._t_fine = var1 + var2;
        const T = (this._t_fine * 5 + 128) >> 8;
        return T;
    }
    calibration_P(adc_P) {
        let pvar1 = this._t_fine / 2 - 64000;
        let pvar2 = (pvar1 * pvar1 * this._calibrated.dig_P6) / 32768;
        pvar2 = pvar2 + pvar1 * this._calibrated.dig_P5 * 2;
        pvar2 = pvar2 / 4 + this._calibrated.dig_P4 * 65536;
        pvar1 =
            ((this._calibrated.dig_P3 * pvar1 * pvar1) / 524288 +
                this._calibrated.dig_P2 * pvar1) /
                524288;
        pvar1 = (1 + pvar1 / 32768) * this._calibrated.dig_P1;
        if (pvar1 !== 0) {
            let p = 1048576 - adc_P;
            p = ((p - pvar2 / 4096) * 6250) / pvar1;
            pvar1 = (this._calibrated.dig_P9 * p * p) / 2147483648;
            pvar2 = (p * this._calibrated.dig_P8) / 32768;
            p = p + (pvar1 + pvar2 + this._calibrated.dig_P7) / 16;
            return p;
        }
        return 0;
    }
}
exports.default = BMP280;
