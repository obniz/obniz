/**
 * @packageDocumentation
 * @module Parts.Solenoid
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface SolenoidOptions {
    signal: number;
    gnd?: number;
}
export default class Solenoid implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    protected obniz: Obniz;
    private io_gnd?;
    private io_signal;
    constructor();
    wired(obniz: Obniz): void;
    on(): void;
    off(): void;
    click(time_msec?: number): void;
    doubleClick(time_msec?: number): void;
}
