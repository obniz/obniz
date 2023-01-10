"use strict";
/**
 * @packageDocumentation
 * @module Parts.AK09916
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i2cParts_1 = __importDefault(require("../../i2cParts"));
class AK09916 extends i2cParts_1.default {
    constructor() {
        super();
        this.i2cinfo = {
            address: 0x0c,
            clock: 100000,
            voltage: '3v',
            pull: '3v',
        };
        this.ADDR = 0x0c;
        this._WIA = 0x01;
        this._HXL = 0x11;
        this._HXH = 0x12;
        this._HYL = 0x13;
        this._HYH = 0x14;
        this._HZL = 0x15;
        this._HZH = 0x16;
        this._ST2 = 0x18;
        this._CNTL2 = 0x31;
        this._ASAX = 0x60;
        this._ASAY = 0x61;
        this._ASAZ = 0x62;
        this._MODE_POWER_DOWN = 0b00000000;
        this.MODE_SINGLE_MEASURE = 0b00000001;
        this.MODE_CONTINOUS_MEASURE_1 = 0b00000010; // 10Hz
        this.MODE_CONTINOUS_MEASURE_2 = 0b00001000; // 100Hz
        this.MODE_EXTERNAL_TRIGGER_MEASURE = 0b00000100;
        this._MODE_SELF_TEST = 0b00001000;
        this._MODE_FUSE_ROM_ACCESS = 0b00011111;
        this.OUTPUT_14_BIT = 0b00000000;
        this.OUTPUT_16_BIT = 0b00010000;
        this._SO_14BIT = 0.6; // per digit when 14bit mode
        this._SO_16BIT = 0.15; //  per digit when 16bit mode
        this.offset = [0, 0, 0];
        this.scale = [1, 1, 1];
        this.so = this._SO_16BIT;
    }
    static info() {
        return {
            name: 'AK09916',
        };
    }
    wired(obniz) {
        super.wired(obniz);
        this.write(this._CNTL2, this.MODE_CONTINOUS_MEASURE_1);
    }
    /**
     * @deprecated
     */
    magnetic() {
        return this.magneticWait();
    }
    async magneticWait() {
        // 0111 1111 1111 0000 4912 uT
        // 1111 1111 1111 1111 -1 uT
        // 1000 0000 0001 0000 -4912 uT
        const raw3 = await this.readThreeInt16Wait(this._HXL, 'l');
        await this.readWait(this._ST2, 1);
        const xyz = raw3.map((d, i) => {
            return (d * this.so - this.offset[i]) * this.scale[i];
        });
        return xyz;
    }
    async whoamiWait() {
        const result = await this.readWait(this._WIA, 1);
        return result[0];
    }
    async calibrateWait(count = 256, delay = 200) {
        this.offset = [0, 0, 0];
        this.scale = [1, 1, 1];
        let reading = await this.magnetic();
        let minx = reading[0];
        let maxx = reading[0];
        let miny = reading[1];
        let maxy = reading[1];
        let minz = reading[2];
        let maxz = reading[2];
        while (count > 0) {
            await new Promise((r) => setTimeout(r, delay));
            reading = await this.magnetic();
            minx = Math.min(minx, reading[0]);
            maxx = Math.max(maxx, reading[0]);
            miny = Math.min(miny, reading[1]);
            maxy = Math.max(maxy, reading[1]);
            minz = Math.min(minz, reading[2]);
            maxz = Math.max(maxz, reading[2]);
            count -= 1;
        }
        // Hard iron correction
        const offset_x = (maxx + minx) / 2;
        const offset_y = (maxy + miny) / 2;
        const offset_z = (maxz + minz) / 2;
        this.offset = [offset_x, offset_y, offset_z];
        // Soft iron correction
        const avg_delta_x = (maxx - minx) / 2;
        const avg_delta_y = (maxy - miny) / 2;
        const avg_delta_z = (maxz - minz) / 2;
        const avg_delta = (avg_delta_x + avg_delta_y + avg_delta_z) / 3;
        const scale_x = avg_delta / avg_delta_x;
        const scale_y = avg_delta / avg_delta_y;
        const scale_z = avg_delta / avg_delta_z;
        this.scale = [scale_x, scale_y, scale_z];
        return { offset: this.offset, scale: this.scale };
    }
}
exports.default = AK09916;
