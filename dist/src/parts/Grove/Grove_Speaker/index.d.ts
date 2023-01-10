/**
 * @packageDocumentation
 * @module Parts.Grove_Speaker
 */
import Obniz from '../../../obniz';
import { PeripheralGrove } from '../../../obniz/libs/io_peripherals/grove';
import { PeripheralPWM } from '../../../obniz/libs/io_peripherals/pwm';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
interface Grove_SpeakerOptionsA {
    vcc?: number;
    gnd?: number;
    signal: number;
}
interface Grove_SpeakerOptionsB {
    grove: PeripheralGrove;
}
export declare type Grove_SpeakerOptions = Grove_SpeakerOptionsA | Grove_SpeakerOptionsB;
export default class Grove_Speaker implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    pwm: PeripheralPWM;
    protected obniz: Obniz;
    constructor();
    onchange(value: number): void;
    wired(obniz: Obniz): void;
    play(frequency: number): void;
    stop(): void;
}
export {};
