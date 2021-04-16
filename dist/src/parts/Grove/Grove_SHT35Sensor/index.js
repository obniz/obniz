"use strict";
/**
 * @packageDocumentation
 * @module Parts.Grove_SHT35Sensor
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Grove_SHT35Sensor {
    constructor() {
        this.SHT35_IIC_ADDR = 0x45;
        this.CMD_SOFT_RST = 0x30a2;
        this.HIGH_REP_WITH_STRCH = 0x2c06;
        this.NO_ERROR = 0;
        this.ERROR_PARAM = -1;
        this.ERROR_COMM = -2;
        this.ERROR_OTHERS = -128;
        this.launched = false;
        this.keys = ['gnd', 'vcc', 'sda', 'scl', 'grove'];
        this.requiredKeys = [];
        this.ioKeys = this.keys;
        this.displayName = 'GroveSHT35';
        this.displayIoNames = { sda: 'sda', scl: 'scl' };
    }
    static info() {
        return {
            name: 'Grove_SHT35Sensor',
        };
    }
    wired(obniz) {
        if (this.params.grove) {
            this.i2c = this.params.grove.getI2c(400000, '5v');
        }
        else {
            this.vcc = this.params.vcc;
            this.gnd = this.params.gnd;
            this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
            this.params.clock = 400000;
            this.params.mode = 'master';
            this.i2c = obniz.getI2CWithConfig(this.params);
        }
        this.obniz.wait(100);
        this.sendCommandWait(this.CMD_SOFT_RST)
            .then(() => {
            return this.obniz.wait(100);
        })
            .then(() => {
            this.launched = true;
        });
    }
    async readMeasDataSingleShotWait(cfg_cmd) {
        let temp_hex = 0;
        let hum_hex = 0;
        let temp = 0;
        let hum = 0;
        if (this.launched) {
            await this.sendCommandWait(cfg_cmd);
            const data = await this.i2c.readWait(this.SHT35_IIC_ADDR, 6);
            temp_hex = (data[0] << 8) | data[1];
            hum_hex = (data[3] << 8) | data[4];
            temp = (temp_hex / 65535.0) * 175 - 45;
            hum = (hum_hex / 65535.0) * 100.0;
        }
        const ret = {
            temperature: temp,
            humidity: hum,
        };
        return ret;
    }
    async sendCommandWait(cmd) {
        const ret = 0;
        const val1 = (cmd >> 8) & 0xff;
        const val2 = cmd & 0xff;
        this.i2c.write(this.SHT35_IIC_ADDR, [val1, val2]);
    }
    async getAllWait() {
        const ret = await this.readMeasDataSingleShotWait(this.HIGH_REP_WITH_STRCH);
        return ret;
    }
}
exports.default = Grove_SHT35Sensor;
