/**
 * @packageDocumentation
 * @module Parts.CT10
 */
import Obniz from '../../../obniz';
import { PeripheralIO } from '../../../obniz/libs/io_peripherals/io';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface CT10Options {
    signal: number;
    vcc?: number;
    gnd?: number;
}
export default class CT10 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    onChangeForStateWait: any;
    io_signal: PeripheralIO;
    io_vcc?: PeripheralIO;
    io_supply?: PeripheralIO;
    isNear: boolean | null;
    onchange: ((near: boolean) => void) | null;
    constructor();
    wired(obniz: Obniz): void;
    isNearWait(): Promise<boolean>;
    stateWait(isNear: boolean): Promise<void>;
}
