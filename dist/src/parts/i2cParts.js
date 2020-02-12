"use strict";
/**
 * @packageDocumentation
 * @module Parts
 */
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
class I2cPartsAbstruct {
    constructor() {
        this.keys = ["gnd", "vcc", "sda", "scl", "i2c", "vcc"];
        this.requiredKeys = [];
        this.i2cinfo = this.i2cInfo();
        this.address = this.i2cinfo.address;
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
    readWait(command, length) {
        return __awaiter(this, void 0, void 0, function* () {
            this.i2c.write(this.address, [command]);
            return yield this.i2c.readWait(this.address, length);
        });
    }
    // public async readUint16Wait(command: number, length: number): Promise<number[]> {
    //   this.i2c.write(this.address, [command]);
    //   return await this.i2c.readWait(this.address, length);
    // }
    write(command, buf) {
        if (!Array.isArray(buf)) {
            buf = [buf];
        }
        this.i2c.write(this.address, [command, ...buf]);
    }
}
exports.default = I2cPartsAbstruct;

//# sourceMappingURL=i2cParts.js.map
