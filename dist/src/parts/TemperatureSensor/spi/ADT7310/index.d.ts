/**
 * @packageDocumentation
 * @module Parts.ADT7310
 */
import Obniz from '../../../../obniz';
import { PeripheralSPI } from '../../../../obniz/libs/io_peripherals/spi';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../../obniz/ObnizPartsInterface';
export interface ADT7310Options {
    vcc: number;
    gnd: number;
    din: number;
    dout: number;
    sclk: number;
}
export default class ADT7310 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    protected obniz: Obniz;
    protected spi: PeripheralSPI;
    constructor();
    wired(obniz: Obniz): void;
    getTempWait(): Promise<number>;
}
