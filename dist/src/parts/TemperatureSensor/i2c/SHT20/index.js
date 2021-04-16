"use strict";
/**
 * @packageDocumentation
 * @module Parts.SHT20
 */
Object.defineProperty(exports, "__esModule", { value: true });
class SHT20 {
    constructor() {
        this.requiredKeys = [];
        this.keys = ['vcc', 'sda', 'scl', 'gnd', 'i2c', 'pull'];
        this.ioKeys = ['vcc', 'sda', 'scl', 'gnd'];
        this.commands = {};
        this.commands.softReset = [0xfe];
        this.commands.tempNoHold = [0xf3];
        this.commands.humidityNoHold = [0xf5];
    }
    static info() {
        return {
            name: 'SHT20',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '3v');
        this.address = 0x40;
        this.params.clock = this.params.clock || 100 * 1000; // for i2c
        this.params.mode = this.params.mode || 'master'; // for i2c
        this.params.pull = this.params.pull || '3v'; // for i2c
        this.i2c = obniz.getI2CWithConfig(this.params);
        this.i2c.write(this.address, this.commands.softReset);
        this.obniz.wait(50);
    }
    /**
     * @deprecated
     * @param command
     */
    getData(command) {
        return this.getDataWait(command);
    }
    async getDataWait(command) {
        this.i2c.write(this.address, command);
        await this.obniz.wait(100);
        const data = await this.i2c.readWait(this.address, 3);
        const rawValue = (data[0] << 8) | data[1];
        if (this.checkCRC(rawValue, data[2]) !== 0) {
            return -2;
        }
        return rawValue & 0xfffc;
    }
    async getTempWait() {
        const rawTemperature = await this.getDataWait(this.commands.tempNoHold);
        if (rawTemperature < 0) {
            console.log('error sht20', rawTemperature);
            return rawTemperature;
        }
        return rawTemperature * (175.72 / 65536.0) - 46.85;
    }
    async getHumidWait() {
        const rawHumidity = await this.getDataWait(this.commands.humidityNoHold);
        if (rawHumidity < 0) {
            console.log('error sht20', rawHumidity);
            return rawHumidity;
        }
        return rawHumidity * (125.0 / 65536.0) - 6.0;
    }
    checkCRC(message_from_sensor, check_value_from_sensor) {
        let remainder = message_from_sensor << 8;
        remainder |= check_value_from_sensor;
        let divsor = 0x988000;
        for (let i = 0; i < 16; i++) {
            if (remainder & (1 << (23 - i))) {
                remainder ^= divsor;
            }
            divsor >>= 1;
        }
        return remainder;
    }
}
exports.default = SHT20;
