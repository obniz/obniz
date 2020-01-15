import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface InfraredLEDOptions {
}
declare class InfraredLED implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    dataSymbolLength: any;
    obniz: Obniz;
    params: any;
    io_cathode: any;
    pwm: any;
    constructor();
    wired(obniz: Obniz): void;
    send(arr: any): void;
}
export default InfraredLED;
