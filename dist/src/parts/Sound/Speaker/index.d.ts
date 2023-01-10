/**
 * @packageDocumentation
 * @module Parts.Speaker
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface SpeakerOptions {
    signal: number;
    gnd?: number;
}
export default class Speaker implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    protected obniz: Obniz;
    private pwm;
    constructor(obniz: any);
    wired(obniz: Obniz): void;
    play(frequency: number): void;
    stop(): void;
}
