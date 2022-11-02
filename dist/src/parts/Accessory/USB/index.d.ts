/**
 * @packageDocumentation
 * @module Parts.USB
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface USBOptions {
    vcc: number;
    gnd: number;
}
export default class USB implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    displayIoNames: any;
    obniz: Obniz;
    io_vdd: any;
    params: any;
    io_gnd: any;
    constructor();
    wired(obniz: Obniz): void;
    on(): void;
    off(): void;
}
