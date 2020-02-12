/**
 * @packageDocumentation
 * @module Parts
 */
import Obniz from "../../../obniz";
import PeripheralUART from "../../../obniz/libs/io_peripherals/uart";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
/**
 * @category Parts
 */
export interface Puls08M5stickcSOptions {
    vcc?: number;
    gnd?: number;
    rx: number;
    tx: number;
}
/**
 * @category Parts
 */
export default class Puls08M5stickcS implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    delimiter: any;
    obniz: Obniz;
    params: any;
    uart: PeripheralUART;
    receivingData: any;
    constructor();
    onbpmupdate(bpm: number | null): void;
    onrawupdate(values: number[]): void;
    wired(obniz: Obniz): void;
    decode(data: any): string;
    init(): void;
}
