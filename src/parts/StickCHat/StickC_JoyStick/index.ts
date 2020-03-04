import Obniz from "../../../obniz";
import PeripheralGrove from "../../../obniz/libs/io_peripherals/grove";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";

import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";
import {I2cPartsAbstructOptions} from "../../i2cParts";

export type  StickC_JoyStickOptions = I2cPartsAbstructOptions ;

export default class StickC_JoyStick implements ObnizPartsInterface {

    public static info(): ObnizPartsInfo {
        return {
            name: "StickC_JoyStick",
        };
    }

    public requiredKeys: string[];
    public keys: string[];
    public params: any;

    protected obniz!: Obniz;
    protected i2c!: PeripheralI2C;

    constructor() {
        this.keys = ["vcc", "gnd", "sda", "scl", "i2c", "grove"];
        this.requiredKeys = [];
    }

    public wired(obniz: Obniz) {
        this.obniz = obniz;
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.obniz.wait(100); // wait for booting of STM32F030F4
        this.params.mode = "master";
        this.params.clock = 100000;
        this.params.pull = "5v";
        this.i2c = this.obniz.getI2CWithConfig(this.params);
    }

    public async getXWait(): Promise<number> {
        const ret = await this.getXYWait();
        let val = ret[0];
        if (val > 0x7F) {
            val = val - 0x100;
        }
        return val;
    }

    public async getYWait(): Promise<number> {
        const ret = await this.getXYWait();
        let val = ret[1];
        if (val > 0x7F) {
            val = val - 0x100;
        }
        return val;
    }

    public async isPressedWait(): Promise<boolean> {
        this.i2c.write(0x38, [0x02]);
        const ret = await this.i2c.readWait(0x38, 3);
        return !Boolean(ret[2]);
    }

    protected async getXYWait(): Promise<number[]> {
        this.i2c.write(0x38, [0x02]);
        const ret = await this.i2c.readWait(0x38, 3);
        return ret;
    }
}
