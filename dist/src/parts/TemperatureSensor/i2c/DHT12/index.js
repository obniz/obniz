"use strict";
/**
 * @packageDocumentation
 * @module Parts.DHT12
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i2cParts_1 = __importDefault(require("../../../i2cParts"));
class DHT12 extends i2cParts_1.default {
    constructor() {
        super();
        this.i2cinfo = {
            address: 0x5c,
            clock: 100000,
            voltage: '3v',
            pull: '3v',
        };
    }
    static info() {
        return {
            name: 'DHT12',
        };
    }
    i2cInfo() {
        return this.i2cinfo;
    }
    async getAllDataWait() {
        const data = await this.readWait(0x00, 5);
        const humidity = data[0] + data[1] * 0.1;
        let temperature = data[2] + (data[3] & 0x7f) * 0.1;
        if (data[3] & 0x80) {
            temperature *= -1;
        }
        const checksum = data[0] + data[1] + data[2] + data[3];
        if (checksum !== data[4]) {
            throw new Error(`checksum does not match`);
        }
        return {
            humidity,
            temperature,
        };
    }
    async getTempWait() {
        return (await this.getAllDataWait()).temperature;
    }
    async getHumdWait() {
        return await this.getHumidWait();
    }
    async getHumidWait() {
        return (await this.getAllDataWait()).humidity;
    }
}
exports.default = DHT12;
