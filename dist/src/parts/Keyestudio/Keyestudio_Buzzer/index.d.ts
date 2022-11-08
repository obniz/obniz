/**
 * @packageDocumentation
 * @module Parts.Keyestudio_Buzzer
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface Keyestudio_BuzzerOptions {
    signal: number;
    gnd?: number;
    vcc?: number;
}
export default class Keyestudio_Buzzer implements ObnizPartsInterface {
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
