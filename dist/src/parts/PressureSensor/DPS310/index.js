"use strict";
/**
 * @packageDocumentation
 * @module Parts.DPS310
 */
Object.defineProperty(exports, "__esModule", { value: true });
class DPS310 {
    constructor() {
        this.configration = {
            DPS310__STD_SLAVE_ADDRESS: 0x77,
        };
        this.DPS310__OSR_SE = 3;
        this.DPS310__LSB = 0x01;
        this.DPS310__PRS_STD_MR = 2;
        this.DPS310__PRS_STD_OSR = 3;
        this.DPS310__TEMP_STD_MR = 2;
        this.DPS310__TEMP_STD_OSR = 3;
        this.DPS310__SUCCEEDED = 0;
        this.DPS310__FAIL_UNKNOWN = -1;
        this.DPS310__FAIL_INIT_FAILED = -2;
        this.DPS310__FAIL_TOOBUSY = -3;
        this.DPS310__FAIL_UNFINISHED = -4;
        this.prsMr = 0;
        this.prsOsr = 0;
        this.tempMr = 0;
        this.tempOsr = 0;
        this.m_lastTempScal = 0;
        this.mode = {
            IDLE: 0x00,
            CMD_PRS: 0x01,
            CMD_TEMP: 0x02,
            INVAL_OP_CMD_BOTH: 0x03,
            INVAL_OP_CONT_NONE: 0x04,
            CONT_PRS: 0x05,
            CONT_TMP: 0x06,
            CONT_BOTH: 0x07,
        };
        this.bitFileds = {
            DPS310__REG_INFO_PROD_ID: {
                address: 0x0d,
                mask: 0x0f,
                shift: 0,
            },
            DPS310__REG_INFO_REV_ID: {
                address: 0x0d,
                mask: 0xf0,
                shift: 4,
            },
            DPS310__REG_INFO_TEMP_SENSORREC: {
                address: 0x28,
                mask: 0x80,
                shift: 7,
            },
            DPS310__REG_INFO_TEMP_SENSOR: {
                address: 0x07,
                mask: 0x80,
                shift: 7,
            },
            DPS310__REG_INFO_OPMODE: {
                address: 0x08,
                mask: 0x07,
                shift: 0,
            },
            DPS310__REG_INFO_FIFO_FL: {
                address: 0x0c,
                mask: 0x80,
                shift: 7,
            },
            DPS310__REG_INFO_FIFO_EN: {
                address: 0x09,
                mask: 0x02,
                shift: 1,
            },
            DPS310__REG_INFO_TEMP_MR: {
                address: 0x07,
                mask: 0x70,
                shift: 4,
            },
            DPS310__REG_INFO_TEMP_OSR: {
                address: 0x07,
                mask: 0x07,
                shift: 0,
            },
            DPS310__REG_INFO_PRS_MR: {
                address: 0x06,
                mask: 0x70,
                shift: 4,
            },
            DPS310__REG_INFO_PRS_OSR: {
                address: 0x06,
                mask: 0x07,
                shift: 0,
            },
            DPS310__REG_INFO_PRS_SE: {
                address: 0x09,
                mask: 0x04,
                shift: 2,
            },
            DPS310__REG_INFO_PRS_RDY: {
                address: 0x08,
                mask: 0x10,
                shift: 4,
            },
            DPS310__REG_INFO_TEMP_SE: {
                address: 0x09,
                mask: 0x08,
                shift: 3,
            },
            DPS310__REG_INFO_TEMP_RDY: {
                address: 0x08,
                mask: 0x20,
                shift: 5,
            },
        };
        this.dataBlock = {
            DPS310__REG_ADR_COEF: {
                address: 0x10,
                length: 18,
            },
            DPS310__REG_ADR_PRS: {
                address: 0x00,
                length: 3,
            },
            DPS310__REG_ADR_TEMP: {
                address: 0x03,
                length: 3,
            },
        };
        this.scaling_facts = [
            524288,
            1572864,
            3670016,
            7864320,
            253952,
            516096,
            1040384,
            2088960,
        ];
        this.requiredKeys = ['sda', 'scl'];
        this.keys = ['gpio3', 'vcc', 'gnd', 'scl', 'sda'];
        this.ioKeys = ['gpio3', 'vcc', 'gnd', 'scl', 'sda'];
        this.coeffs = {};
        this.opMode = this.mode.IDLE;
    }
    static info() {
        return {
            name: 'DPS310',
            datasheet: '',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.address = 0x77;
        this.params.clock = this.params.clock || 100 * 1000;
        this.params.mode = 'master';
        this.params.pull = '3v';
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.obniz.wait(10);
    }
    async initWait() {
        const prodId = await this.readByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_PROD_ID);
        if (prodId !== 0) {
            throw new Error('invalid prodId');
        }
        await this.readByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_REV_ID);
        await this.readByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_TEMP_SENSORREC);
        await this.writeByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_TEMP_SENSOR, 0);
        await this.readCoeffsWait();
        await this.standbyWait();
        await this.configTempWait(this.DPS310__TEMP_STD_MR, this.DPS310__TEMP_STD_OSR);
        await this.configPressureWait(this.DPS310__PRS_STD_MR, this.DPS310__PRS_STD_OSR);
        await this.standbyWait();
        await this.measureTempOnceWait();
        await this.standbyWait();
        await this.correctTempWait();
    }
    async measurePressureOnceWait(oversamplingRate) {
        if (oversamplingRate === undefined) {
            oversamplingRate = this.prsOsr;
        }
        await this.startMeasurePressureOnceWait(oversamplingRate);
        await this.obniz.wait(100);
        const ret = await this.getSingleResultWait();
        return ret;
    }
    async readByteWait(regAddress) {
        this.i2c.write(this.address, [regAddress]);
        await this.obniz.wait(1);
        const results = await this.i2c.readWait(this.address, 1);
        return results[0];
    }
    async readByteBitfieldWait(field) {
        const regAddress = field.address;
        const mask = field.mask;
        const shift = field.shift;
        let ret = await this.readByteWait(regAddress);
        if (ret < 0) {
            return ret;
        }
        if (mask !== undefined) {
            ret = ret & mask;
        }
        if (shift !== undefined) {
            ret = ret >> shift;
        }
        return ret;
    }
    async readBlockWait(datablock) {
        const address = datablock.address;
        const length = datablock.length;
        await this.obniz.wait(1);
        this.i2c.write(this.address, [address]);
        const results = await this.i2c.readWait(this.address, length);
        return results;
    }
    async writeByteWait(regAddress, data, check) {
        this.i2c.write(this.address, [regAddress, data]);
        if (check) {
            if ((await this.readByteWait(regAddress)) !== data) {
                throw new Error('DPS310 data write failed');
            }
        }
    }
    async writeByteBitfieldWait(field, data, check) {
        const old = await this.readByteWait(field.address);
        const sendData = (old & ~field.mask) | ((data << field.shift) & field.mask);
        await this.writeByteWait(field.address, sendData, check);
    }
    async setOpModeDetailWait(background, temperature, pressure) {
        const opMode = ((background & this.DPS310__LSB) << 2) |
            ((temperature & this.DPS310__LSB) << 1) |
            (pressure & this.DPS310__LSB);
        return await this.setOpModeWait(opMode);
    }
    async setOpModeWait(opMode) {
        opMode &=
            this.bitFileds.DPS310__REG_INFO_OPMODE.mask >>
                this.bitFileds.DPS310__REG_INFO_OPMODE.shift;
        await this.writeByteWait(this.bitFileds.DPS310__REG_INFO_OPMODE.address, opMode);
        this.opMode = opMode;
    }
    async standbyWait() {
        this.setOpModeWait(this.mode.IDLE);
        await this.writeByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_FIFO_FL, 1);
        await this.writeByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_FIFO_EN, 0);
    }
    async configTempWait(tempMr, tempOsr) {
        await this.writeByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_TEMP_MR, tempMr);
        await this.writeByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_TEMP_OSR, tempOsr);
        if (tempOsr > this.DPS310__OSR_SE) {
            await this.writeByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_TEMP_SE, 1);
        }
        else {
            await this.writeByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_TEMP_SE, 0);
        }
        this.tempMr = tempMr;
        this.tempOsr = tempOsr;
    }
    async configPressureWait(prsMr, prsOsr) {
        await this.writeByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_PRS_MR, prsMr);
        await this.writeByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_PRS_OSR, prsOsr);
        if (prsOsr > this.DPS310__OSR_SE) {
            await this.writeByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_PRS_SE, 1);
        }
        else {
            await this.writeByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_PRS_SE, 0);
        }
        this.prsMr = prsMr;
        this.prsOsr = prsOsr;
    }
    async readCoeffsWait() {
        const buffer = await this.readBlockWait(this.dataBlock.DPS310__REG_ADR_COEF);
        this.coeffs.m_c0Half = (buffer[0] << 4) | ((buffer[1] >> 4) & 0x0f);
        if (this.coeffs.m_c0Half & (1 << 11)) {
            this.coeffs.m_c0Half -= 1 << 12;
        }
        this.coeffs.m_c0Half = this.coeffs.m_c0Half / 2;
        this.coeffs.m_c1 = ((buffer[1] & 0x0f) << 8) | buffer[2];
        if (this.coeffs.m_c1 & (1 << 11)) {
            this.coeffs.m_c1 -= 1 << 12;
        }
        this.coeffs.m_c00 =
            (buffer[3] << 12) | (buffer[4] << 4) | ((buffer[5] >> 4) & 0x0f);
        if (this.coeffs.m_c00 & (1 << 19)) {
            this.coeffs.m_c00 -= 1 << 20;
        }
        this.coeffs.m_c10 =
            ((buffer[5] & 0x0f) << 16) | (buffer[6] << 8) | buffer[7];
        if (this.coeffs.m_c10 & (1 << 19)) {
            this.coeffs.m_c10 -= 1 << 20;
        }
        this.coeffs.m_c01 = (buffer[8] << 8) | buffer[9];
        if (this.coeffs.m_c01 & (1 << 15)) {
            this.coeffs.m_c01 -= 1 << 16;
        }
        this.coeffs.m_c11 = (buffer[10] << 8) | buffer[11];
        if (this.coeffs.m_c11 & (1 << 15)) {
            this.coeffs.m_c11 -= 1 << 16;
        }
        this.coeffs.m_c20 = (buffer[12] << 8) | buffer[13];
        if (this.coeffs.m_c20 & (1 << 15)) {
            this.coeffs.m_c20 -= 1 << 16;
        }
        this.coeffs.m_c21 = (buffer[14] << 8) | buffer[15];
        if (this.coeffs.m_c21 & (1 << 15)) {
            this.coeffs.m_c21 -= 1 << 16;
        }
        this.coeffs.m_c30 = (buffer[16] << 8) | buffer[17];
        if (this.coeffs.m_c30 & (1 << 15)) {
            this.coeffs.m_c30 -= 1 << 16;
        }
    }
    async getSingleResultWait() {
        let rdy;
        switch (this.opMode) {
            case this.mode.CMD_TEMP:
                rdy = await this.readByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_TEMP_RDY);
                break;
            case this.mode.CMD_PRS:
                rdy = await this.readByteBitfieldWait(this.bitFileds.DPS310__REG_INFO_PRS_RDY);
                break;
            default:
                return this.DPS310__FAIL_TOOBUSY;
        }
        let oldMode;
        switch (rdy) {
            case this.DPS310__FAIL_UNKNOWN:
                throw new Error('DPS310__FAIL_UNKNOWN');
            case 0:
                return this.obniz.wait(10).then(() => {
                    return this.getSingleResultWait();
                });
            case 1:
                oldMode = this.opMode;
                this.opMode = this.mode.IDLE;
                switch (oldMode) {
                    case this.mode.CMD_TEMP:
                        return await this.getTempWait();
                    case this.mode.CMD_PRS:
                        return await this.getPressureWait();
                    default:
                        throw new Error('DPS310__FAIL_UNKNOWN');
                }
        }
        throw new Error('DPS310__FAIL_UNKNOWN');
    }
    async startMeasureTempOnceWait(oversamplingRate) {
        await this.configTempWait(0, oversamplingRate);
        await this.setOpModeDetailWait(0, 1, 0);
    }
    async startMeasurePressureOnceWait(oversamplingRate) {
        await this.configPressureWait(0, oversamplingRate);
        await this.setOpModeDetailWait(0, 0, 1);
    }
    calcPressure(raw) {
        let prs = raw;
        prs /= this.scaling_facts[this.prsOsr];
        prs =
            this.coeffs.m_c00 +
                prs *
                    (this.coeffs.m_c10 +
                        prs * (this.coeffs.m_c20 + prs * this.coeffs.m_c30)) +
                this.m_lastTempScal *
                    (this.coeffs.m_c01 +
                        prs * (this.coeffs.m_c11 + prs * this.coeffs.m_c21));
        return prs;
    }
    calcTemp(raw) {
        let temp = raw;
        temp /= this.scaling_facts[this.tempOsr];
        this.m_lastTempScal = temp;
        temp = this.coeffs.m_c0Half + this.coeffs.m_c1 * temp;
        return temp;
    }
    async correctTempWait() {
        this.writeByteWait(0x0e, 0xe5);
        this.writeByteWait(0x0f, 0x96);
        this.writeByteWait(0x62, 0x02);
        this.writeByteWait(0x0e, 0x00);
        this.writeByteWait(0x0f, 0x00);
        await this.measureTempOnceWait();
    }
    async measureTempOnceWait(oversamplingRate) {
        if (oversamplingRate === undefined) {
            oversamplingRate = this.tempOsr;
        }
        await this.startMeasureTempOnceWait(oversamplingRate);
        await this.obniz.wait(100);
        return await this.getSingleResultWait();
    }
    async getTempWait() {
        const data = await this.readBlockWait(this.dataBlock.DPS310__REG_ADR_TEMP);
        let temp = (data[0] << 16) | (data[1] << 8) | data[2];
        if (temp & (1 << 23)) {
            temp -= 1 << 24;
        }
        return this.calcTemp(temp);
    }
    async getPressureWait() {
        const data = await this.readBlockWait(this.dataBlock.DPS310__REG_ADR_PRS);
        let prs = (data[0] << 16) | (data[1] << 8) | data[2];
        if (prs & (1 << 23)) {
            prs -= 1 << 24;
        }
        return this.calcPressure(prs);
    }
}
exports.default = DPS310;
