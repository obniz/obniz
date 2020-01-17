import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface LEDOptions {
    anode: number;
    cathode?: number;
}
declare class LED implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    io_anode: any;
    params: any;
    io_cathode: any;
    animationName: any;
    constructor();
    wired(obniz: Obniz): void;
    on(): void;
    off(): void;
    output(value: any): void;
    endBlink(): void;
    blink(interval: any): void;
}
export default LED;
