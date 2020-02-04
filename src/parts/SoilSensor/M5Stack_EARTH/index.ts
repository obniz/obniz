import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";

import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

export interface M5Stack_EARTHOptions {
    vcc?: number;
    aout: number;
    dout: number;
    gnd?: number;
}

export default class M5Stack_EARTH implements ObnizPartsInterface {

    public static info(): ObnizPartsInfo {
        return {
            name: "M5Stack_EARTH",
        };
    }

    public keys: string[];
    public requiredKeys: string[];
    public params: any;

    public value: any;
    public onchange?: (value: number) => void;

    protected obniz!: Obniz;

    private ad!: PeripheralAD;
    private io!: PeripheralIO;

    constructor() {
        this.keys = ["vcc", "aout", "dout", "gnd"];
        this.requiredKeys = ["aout", "dout"];
    }

    public wired(obniz: Obniz) {
        this.obniz = obniz;
        this.obniz.setVccGnd(this.params.vcc, this.params.gnd, "5v");
        this.ad = obniz.getAD(this.params.aout);
        this.io = obniz.getIO(this.params.dout);

        this.ad.start((value: number) => {
            this.value = value;
            if (this.onchange) {
                this.onchange(this.value);
            }
        });
    }

    public async getHumidityWait() {
        return await this.ad.getWait();
    }

    public async getDigitalHumidityWait() {
        return await this.io.inputWait();
    }
}
