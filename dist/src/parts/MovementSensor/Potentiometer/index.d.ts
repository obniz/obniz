/**
 * @packageDocumentation
 * @module Parts.Potentiometer
 */
import Obniz from '../../../obniz';
import { PeripheralAD } from '../../../obniz/libs/io_peripherals/ad';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface PotentiometerOptions {
    pin0: number;
    pin1: number;
    pin2: number;
}
export default class Potentiometer implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    vcc_voltage: number;
    ad: PeripheralAD;
    position: number;
    onchange?: (position: number) => void;
    protected obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
}
