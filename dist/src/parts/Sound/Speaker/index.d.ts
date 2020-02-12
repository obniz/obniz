/**
 * @packageDocumentation
 * @module Parts
 */
import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
/**
 * @category Parts
 */
export interface SpeakerOptions {
    signal: number;
    gnd?: number;
}
/**
 * @category Parts
 */
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
