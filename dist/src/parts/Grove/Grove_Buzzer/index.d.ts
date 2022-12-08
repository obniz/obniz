/**
 * @packageDocumentation
 * @module Parts.Grove_Buzzer
 */
import Obniz from '../../../obniz';
import { PeripheralGrove } from '../../../obniz/libs/io_peripherals/grove';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface Grove_BuzzerOptionsA {
    signal: number;
    gnd?: number;
    vcc?: number;
}
interface Grove_BuzzerOptionsB {
    grove: PeripheralGrove;
}
export declare type Grove_BuzzerOptions = Grove_BuzzerOptionsA | Grove_BuzzerOptionsB;
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
export {};
