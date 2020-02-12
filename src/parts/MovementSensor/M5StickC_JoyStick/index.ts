import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";

import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";
import {I2cPartsAbstructOptions} from "../../i2cParts";

export interface M5StickC_JoyStickOptions extends I2cPartsAbstructOptions {
}

export default class M5StickC_JoyStick implements ObnizPartsInterface {

    public static info(): ObnizPartsInfo {
        return {
            name: "M5StickC_JoyStick",
        };
    }

    public requiredKeys: string[];
    public keys: string[];
    public params: any;

    protected obniz!: Obniz;
    protected i2c!: PeripheralI2C;

    constructor() {
        this.requiredKeys = ["sda", "scl"];
        this.keys = ["vcc", "gnd", "sda", "scl", "i2c"];
    }

    public wired(obniz: Obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.obniz.wait(100); // wait for booting of STM32F030F4
        this.params.mode = "master";
        this.params.clock = 100000;
        this.params.pull = "5v";
        this.i2c = this.obniz.getI2CWithConfig(this.params);
    }

    public async getXWait(): Promise<number> {
        this.i2c.write(0x38, [0x02]);
        const ret = await this.i2c.readWait(0x38, 3);
        return ret[0];
    }

    public async getYWait(): Promise<number> {
        this.i2c.write(0x38, [0x02]);
        const ret = await this.i2c.readWait(0x38, 3);
        return ret[1];
    }

    public async isPressedWait(): Promise<boolean> {
        this.i2c.write(0x38, [0x02]);
        const ret = await this.i2c.readWait(0x38, 3);
        return !Boolean(ret[2]);
    }
}
