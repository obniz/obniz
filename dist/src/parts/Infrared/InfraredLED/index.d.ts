import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
/**
 * @category Parts
 */
export interface InfraredLEDOptions {
    anode: number;
    cathode?: number;
}
/**
 * @category Parts
 */
export default class InfraredLED implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    dataSymbolLength: number;
    params: any;
    protected obniz: Obniz;
    private io_cathode?;
    private pwm;
    constructor();
    wired(obniz: Obniz): void;
    send(data: number[]): void;
}
