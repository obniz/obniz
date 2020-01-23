import Obniz from "../../../obniz";
import PeripheralI2C from "../../../obniz/libs/io_peripherals/i2c";

import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

export interface M5Stack_JoyStickOptions {
    vcc: number;
    gnd: number;
    sda: number;
    scl: number;
}

export default class M5Stack_JoyStick implements ObnizPartsInterface {

    public static info(): ObnizPartsInfo {
        return {
            name: "M5Stack_JoyStick",
        };
    }

    public requiredKeys: string[];
    public keys: string[];
    public params: any;

    protected obniz!: Obniz;
    protected i2c!: PeripheralI2C;

    constructor() {
        this.requiredKeys = ["vcc", "gnd", "sda", "scl"];
        this.keys = ["vcc", "gnd", "sda", "scl"];
    }

    public wired(obniz: Obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.obniz.wait(100); // wait for booting of MEGA328
        this.i2c = this.obniz.getFreeI2C();
        this.i2c.start({
            mode: "master",
            sda: this.params.sda,
            scl: this.params.scl,
            clock: 400000,
            pull: "5v",
        });
    }

    public async getXWait(): Promise<number> {
        const ret = await this.i2c.readWait(0x52, 3);
        return ret[0];
    }

    public async getYWait(): Promise<number> {
        const ret = await this.i2c.readWait(0x52, 3);
        return ret[1];
    }

    public async isPressedWait(): Promise<boolean> {
        const ret = await this.i2c.readWait(0x52, 3);
        return Boolean(ret[2]);
    }
}
