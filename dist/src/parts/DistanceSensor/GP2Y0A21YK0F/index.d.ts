/**
 * @packageDocumentation
 * @module Parts.GP2Y0A21YK0F
 */
import Obniz from '../../../obniz';
import { PeripheralAD } from '../../../obniz/libs/io_peripherals/ad';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface GP2Y0A21YK0FOptions {
    vcc?: number;
    gnd?: number;
    signal: number;
}
export declare type GP2Y0A21YK0FUnitType = 'mm' | 'inch';
export default class GP2Y0A21YK0F implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    displayIoNames: {
        vcc: string;
        gnd: string;
        signal: string;
    };
    _unit: GP2Y0A21YK0FUnitType;
    obniz: Obniz;
    params: any;
    ad_signal: PeripheralAD;
    constructor();
    wired(obniz: Obniz): void;
    start(callback: (distance: number) => void): void;
    _volt2distance(val: number): number;
    getWait(): Promise<number>;
    unit(unit: GP2Y0A21YK0FUnitType): void;
}
