import Obniz from "../../../obniz";
import PeripheralAD from "../../../obniz/libs/io_peripherals/ad";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
/**
 * @category Parts
 */
export interface PT550Options {
    signal: number;
    vcc?: number;
    gnd?: number;
}
/**
 * @category Parts
 */
export default class PT550 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    obniz: Obniz;
    params: any;
    signal: PeripheralAD;
    constructor();
    onchange(value: number): void;
    wired(obniz: Obniz): void;
    getWait(): Promise<number>;
}
