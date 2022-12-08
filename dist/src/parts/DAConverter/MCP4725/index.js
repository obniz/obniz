"use strict";
/**
 * @packageDocumentation
 * @module Parts.MCP4725
 */
Object.defineProperty(exports, "__esModule", { value: true });
class MCP4725 {
    constructor() {
        this.cmd = {
            WRITEDAC: 0x40,
            WRITEDACEEPROM: 0x60, // Writes data to the DAC and the EEPROM (persisting the assigned value after reset)
        };
        this._vcc_voltage = 5.0;
        this.keys = ['vcc', 'gnd', 'sda', 'scl', 'i2c'];
        this.requiredKeys = [];
        this.address = 0x60;
    }
    static info() {
        return {
            name: 'MCP4725',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        this.params.clock = 400000;
        this.params.pull = '5v';
        this.params.mode = 'master';
        this.i2c = this.obniz.getI2CWithConfig(this.params);
        this.obniz.wait(100);
    }
    setVCCVoltage(voltage) {
        this._vcc_voltage = voltage;
    }
    setVoltage(voltage, writeEEPROM = false) {
        if (voltage > this._vcc_voltage) {
            voltage = this._vcc_voltage;
        }
        else if (voltage < 0) {
            voltage = 0;
        }
        const mv = Math.round((voltage / this._vcc_voltage) * (4096 - 1));
        const hbits = mv >> 4;
        const lbits = (mv & 0x0f) << 4;
        if (writeEEPROM) {
            this.i2c.write(this.address, [this.cmd.WRITEDACEEPROM, hbits, lbits]);
        }
        else {
            this.i2c.write(this.address, [this.cmd.WRITEDAC, hbits, lbits]);
        }
    }
}
exports.default = MCP4725;
