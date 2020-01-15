import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface SpeakerOptions {
}
declare class Speaker implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    params: any;
    pwm: any;
    constructor(obniz: any);
    wired(obniz: Obniz): void;
    play(freq: any): void;
    stop(): void;
}
export default Speaker;
