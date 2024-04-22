"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @packageDocumentation
 * @module Parts.DHT20
 */
const round_to_1 = __importDefault(require("round-to"));
const i2cParts_1 = __importDefault(require("../../../i2cParts"));
class DHT20 extends i2cParts_1.default {
    constructor() {
        super();
        this.i2cinfo = {
            address: 0x38,
            clock: 100000,
            voltage: '3v',
            pull: '3v',
        };
    }
    static info() {
        return {
            name: 'DHT20',
        };
    }
    i2cInfo() {
        return this.i2cinfo;
    }
    async getAllDataWait() {
        this.i2c.write(this.i2cinfo.address, [0xac, 0x33, 0x00]);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.obniz.wait(100).then(() => { });
        const val = await this.i2c.readWait(this.i2cinfo.address, 6);
        const state = val[0];
        const flg = state & 0x80;
        // 連続20bit
        const humidityData = (val[1] << 12) | (val[2] << 4) | ((val[3] & 0x0f) >> 4);
        const humidity = (0, round_to_1.default)(humidityData / 10485.76, 2);
        // その後20bit
        const temperatureData = ((val[3] & 0x0f) << 16) | (val[4] << 8) | val[5];
        const temperature = (0, round_to_1.default)(temperatureData / 5242.88 - 50, 2);
        return {
            humidity,
            temperature,
        };
    }
    async getTemperatureWait() {
        return (await this.getAllDataWait()).temperature;
    }
    async getHumidityWait() {
        return (await this.getAllDataWait()).humidity;
    }
}
exports.default = DHT20;
