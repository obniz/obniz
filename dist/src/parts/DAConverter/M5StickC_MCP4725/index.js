"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class M5StickC_AMDP4725 {
    constructor() {
        this.cmd = {
            WRITEDAC: 0x40,
            WRITEDACEEPROM: 0x60,
        };
        this.keys = ["vcc", "gnd", "sda", "scl"];
        this.requiredKeys = ["sda", "scl"];
        this.address = 0x60;
    }
    static info() {
        return {
            name: "M5StickC_MCP4725",
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.i2c = this.obniz.getFreeI2C();
        this.i2c.start({
            mode: "master",
            sda: this.params.sda,
            scl: this.params.scl,
            clock: 400000,
            pull: "5v",
        });
        this.obniz.wait(100);
    }
    setVoltage(voltage, writeEEPROM = false) {
        if (writeEEPROM) {
            this.i2c.write(this.address, [this.cmd.WRITEDACEEPROM, voltage / 16, (voltage % 16) << 4]);
        }
        else {
            this.i2c.write(this.address, [this.cmd.WRITEDAC, voltage / 16, (voltage % 16) << 4]);
        }
    }
}
exports.default = M5StickC_AMDP4725;

//# sourceMappingURL=index.js.map
