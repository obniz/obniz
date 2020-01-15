import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface Grove_BuzzerOptions {
}
declare class Grove_Buzzer implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
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
export default Grove_Buzzer;
