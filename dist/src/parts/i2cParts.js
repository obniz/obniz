"use strict";
/**
 * @packageDocumentation
 * @module Parts
 */
Object.defineProperty(exports, "__esModule", { value: true });
class I2cPartsAbstract {
    constructor() {
        this.keys = [
            'gnd',
            'vcc',
            'sda',
            'scl',
            'i2c',
            'pull',
            'clock',
            'voltage',
            'address',
        ];
        this.requiredKeys = [];
    }
    static charArrayToInt16(values, endian = 'b') {
        const buffer = new ArrayBuffer(2);
        const dv = new DataView(buffer);
        dv.setUint8(0, values[0]);
        dv.setUint8(1, values[1]);
        return dv.getInt16(0, endian !== 'b');
    }
    static charArrayToXyz(data, endian = 'b', scaleFunc = (d) => d) {
        return {
            x: scaleFunc(I2cPartsAbstract.charArrayToInt16(data.slice(0, 2), endian)),
            y: scaleFunc(I2cPartsAbstract.charArrayToInt16(data.slice(2, 4), endian)),
            z: scaleFunc(I2cPartsAbstract.charArrayToInt16(data.slice(4, 6), endian)),
        };
    }
    // public abstract info(): ObnizPartsInfo;
    i2cInfo() {
        return this.i2cinfo;
    }
    wired(obniz) {
        this.obniz = obniz;
        Object.keys(this.i2cinfo).map((k) => {
            if (typeof this.params[k] === 'undefined') {
                this.params[k] = this.i2cinfo[k];
            }
            else {
                this.i2cinfo[k] = this.params[k];
            }
        });
        obniz.setVccGnd(this.params.vcc, this.params.gnd, this.params.voltage);
        this.params.mode = 'master';
        this.i2c = this.obniz.getI2CWithConfig(this.params);
        this.address = this.i2cinfo.address;
    }
    char2short(val1, val2) {
        const buffer = new ArrayBuffer(2);
        const dv = new DataView(buffer);
        dv.setUint8(0, val1);
        dv.setUint8(1, val2);
        return dv.getInt16(0, false);
    }
    async readWait(command, length) {
        this.i2c.write(this.address, [command]);
        return await this.i2c.readWait(this.address, length);
    }
    write(command, buf) {
        if (!Array.isArray(buf)) {
            buf = [buf];
        }
        this.i2c.write(this.address, [command, ...buf]);
    }
    async writeFlagWait(address, index) {
        const tempdata = await this.readWait(address, 1);
        tempdata[0] = tempdata[0] | (0b1 << index);
        this.write(address, tempdata);
    }
    async clearFlagWait(address, index) {
        const tempdata = await this.readWait(address, 1);
        tempdata[0] = tempdata[0] & (0xff - (0b1 << index));
        this.write(address, tempdata);
    }
    async readInt16Wait(register, endian = 'b') {
        const data = (await this.readWait(register, 2));
        return I2cPartsAbstract.charArrayToInt16(data, endian);
    }
    async readThreeInt16Wait(register, endian = 'b') {
        const data = await this.readWait(register, 6);
        const results = [0, 0, 0];
        results[0] = I2cPartsAbstract.charArrayToInt16(data.slice(0, 2), endian);
        results[1] = I2cPartsAbstract.charArrayToInt16(data.slice(2, 4), endian);
        results[2] = I2cPartsAbstract.charArrayToInt16(data.slice(4, 6), endian);
        return results;
    }
}
exports.default = I2cPartsAbstract;
