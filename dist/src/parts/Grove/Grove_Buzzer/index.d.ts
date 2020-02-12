/**
 * @packageDocumentation
 * @module Parts.Grove_Buzzer
 */
import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface Grove_BuzzerOptions {
    signal: number;
    gnd?: number;
    vcc?: number;
}
export default class Grove_Buzzer implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    protected obniz: Obniz;
    private pwm;
    constructor();
    wired(obniz: Obniz): void;
    play(freq: number): void;
    stop(): void;
}
