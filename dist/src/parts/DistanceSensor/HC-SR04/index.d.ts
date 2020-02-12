/**
 * @packageDocumentation
 * @module Parts
 */
import Obniz from "../../../obniz";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
/**
 * @category Parts
 */
export interface HCSR04Options {
    gnd?: number;
    echo: number;
    trigger: number;
    vcc: number;
}
export declare type HCSR04UnitType = "mm" | "inch";
/**
 * @category Parts
 */
export default class HCSR04 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    _unit: HCSR04UnitType;
    reset_alltime: boolean;
    temp: number;
    obniz: Obniz;
    params: any;
    vccIO: PeripheralIO;
    trigger: number;
    echo: number;
    constructor();
    wired(obniz: Obniz): void;
    measure(callback: (distance: number) => void): void;
    measureWait(): Promise<unknown>;
    unit(unit: HCSR04UnitType): void;
}
