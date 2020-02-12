import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";

import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";
import {I2cPartsAbstructOptions} from "../../i2cParts";

export interface M5StickC_MCP4725Options extends I2cPartsAbstructOptions {
}

export default class M5StickC_AMDP4725 implements ObnizPartsInterface {

    public static info(): ObnizPartsInfo {
        return {
            name: "M5StickC_MCP4725",
        };
    }

    public keys: string[];
    public requiredKeys: string[];
    public params: any;

    public address: number;
    public cmd = {
        WRITEDAC:       0x40, // Writes data to the DAC
        WRITEDACEEPROM: 0x60, // Writes data to the DAC and the EEPROM (persisting the assigned value after reset)
    };

    protected obniz!: Obniz;
    protected i2c!: PeripheralI2C;

    constructor() {
        this.keys = ["vcc", "gnd", "sda", "scl", "i2c"];
        this.requiredKeys = ["sda", "scl"];
        this.address = 0x60;
    }

    public wired(obniz: Obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.params.clock = 400000;
        this.params.pull = "5v";
        this.params.mode = "master";
        this.i2c = this.obniz.getI2CWithConfig(this.params);
        this.obniz.wait(100);
    }

    public setVoltage(voltage: number, writeEEPROM = false) {
        if (writeEEPROM) {
            this.i2c.write(
                this.address,
                [this.cmd.WRITEDACEEPROM, voltage / 16, (voltage % 16) << 4],
            );
        } else {
            this.i2c.write(
                this.address,
                [this.cmd.WRITEDAC, voltage / 16, (voltage % 16) << 4],
            );
        }
    }
}
