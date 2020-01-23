import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface M5Stack_EARTHOptions {
    vcc?: number;
    aout: number;
    dout: number;
    gnd?: number;
}
export default class M5Stack_EARTH implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    value: any;
    onchange?: (value: number) => void;
    protected obniz: Obniz;
    private ad;
    private io;
    constructor();
    wired(obniz: Obniz): void;
    getAnalogHumidityWait(): Promise<number>;
    getDigitalHumidityWait(): Promise<boolean>;
}
