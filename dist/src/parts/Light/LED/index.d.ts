import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
/**
 * @category Parts
 */
export interface LEDOptions {
    anode?: number;
    cathode?: number;
}
/**
 * @category Parts
 */
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
