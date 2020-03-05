"use strict";
/**
 * @packageDocumentation
 * @module Parts
 */
Object.defineProperty(exports, "__esModule", { value: true });
class I2cPartsAbstruct {
    constructor() {
        this.keys = ["gnd", "vcc", "sda", "scl", "i2c", "vcc"];
        this.requiredKeys = [];
        this.i2cinfo = this.i2cInfo();
        this.address = this.i2cinfo.address;
    }
    static charArrayToInt16(values, endian = "b") {
        const buffer = new ArrayBuffer(2);
        const dv = new DataView(buffer);
        dv.setUint8(0, values[0]);
        dv.setUint8(1, values[1]);
        return dv.getInt16(0, endian !== "b");
    }
    i2cInfo() {
        throw new Error("abstruct class");
        // eslint-disable-next-line no-unreachable
        return {
            address: 0x00,
            clock: 100000,
            voltage: "3v",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, this.i2cinfo.voltage);
        this.params.clock = this.i2cinfo.clock;
        this.params.pull = this.i2cinfo.voltage;
        this.params.mode = "master";
        // @ts-ignore
        this.i2c = this.obniz.getI2CWithConfig(this.params);
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
    async readInt16Wait(register, endian = "b") {
        const data = await this.readWait(register, 2);
        return I2cPartsAbstruct.charArrayToInt16(data, endian);
    }
    async readThreeInt16Wait(register, endian = "b") {
        const data = await this.readWait(register, 6);
        const results = [0, 0, 0];
        results[0] = (I2cPartsAbstruct.charArrayToInt16(data.slice(0, 2), endian));
        results[1] = (I2cPartsAbstruct.charArrayToInt16(data.slice(2, 4), endian));
        results[2] = (I2cPartsAbstruct.charArrayToInt16(data.slice(4, 6), endian));
        return results;
    }
}
exports.default = I2cPartsAbstruct;

//# sourceMappingURL=i2cParts.js.map
