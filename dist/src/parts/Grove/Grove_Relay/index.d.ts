/**
 * @packageDocumentation
 * @module Parts.Grove_Relay
 */
import Obniz from '../../../obniz';
import { PeripheralGrove } from '../../../obniz/libs/io_peripherals/grove';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface Grove_RelayOptionsA {
    signal: number;
    gnd?: number;
    vcc?: number;
}
interface Grove_RelayOptionsB {
    grove: PeripheralGrove;
}
export declare type Grove_RelayOptions = Grove_RelayOptionsA | Grove_RelayOptionsB;
export default class Grove_Relay implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    io_signal: any;
    protected obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
    on(): void;
    off(): void;
}
export {};
