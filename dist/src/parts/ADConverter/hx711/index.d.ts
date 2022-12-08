/**
 * @packageDocumentation
 * @module Parts.hx711
 */
import Obniz from '../../../obniz';
import { PeripheralIO } from '../../../obniz/libs/io_peripherals/io';
import { PeripheralSPI } from '../../../obniz/libs/io_peripherals/spi';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface Hx711Options {
    vcc?: number;
    gnd?: number;
    sck: number;
    dout: number;
}
export default class Hx711 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    _offset: any;
    _scale: any;
    obniz: Obniz;
    spi: PeripheralSPI;
    params: any;
    sck: PeripheralIO;
    dout: PeripheralIO;
    constructor();
    wired(obniz: Obniz): void;
    readWait(): Promise<number>;
    doubleBit2singleBit(a: number, b: number): number;
    bit(a: number, n: number): 1 | 0;
    readAverageWait(times: any): Promise<number>;
    powerDown(): void;
    powerUp(): void;
    zeroAdjustWait(times: number | any): Promise<void>;
    getValueWait(times: number | any): Promise<number>;
    setOffset(offset: any): void;
    setScale(scale: any): void;
}
