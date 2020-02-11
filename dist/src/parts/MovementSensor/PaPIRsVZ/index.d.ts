import Obniz from "../../../obniz";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
/**
 * @category Parts
 */
export interface PaPIRsVZOptions {
    signal: number;
    vcc?: number;
    gnd?: number;
}
/**
 * @category Parts
 */
export default class PaPIRsVZ implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    io_signal: PeripheralIO;
    onchange?: (value: boolean) => void;
    protected obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
}
