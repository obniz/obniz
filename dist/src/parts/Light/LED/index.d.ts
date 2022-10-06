/**
 * @packageDocumentation
 * @module Parts.LED
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface LEDOptions {
    anode?: number;
    cathode?: number;
}
export default class LED implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    protected obniz: Obniz;
    private io_anode?;
    private io_cathode?;
    private animationName;
    constructor();
    wired(obniz: Obniz): void;
    on(): void;
    off(): void;
    output(value: any): void;
    endBlink(): void;
    blink(interval?: number): void;
    private _on;
    private _off;
}
