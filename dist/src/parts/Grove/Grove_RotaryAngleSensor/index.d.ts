/**
 * @packageDocumentation
 * @module Parts.Grove_RotaryAngleSensorOptionsA
 */
import Obniz from '../../../obniz';
import { PeripheralAD } from '../../../obniz/libs/io_peripherals/ad';
import { DriveType } from '../../../obniz/libs/io_peripherals/common';
import { PeripheralGrove } from '../../../obniz/libs/io_peripherals/grove';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
interface Grove_RotaryAngleSensorOptionsA {
    signal: number;
    vcc?: number;
    gnd?: number;
}
interface Grove_RotaryAngleSensorOptionsB {
    grove: PeripheralGrove;
}
export declare type Grove_RotaryAngleSensorOptions = Grove_RotaryAngleSensorOptionsA | Grove_RotaryAngleSensorOptionsB;
export default class Grove_RotaryAngleSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    drive: DriveType;
    position: number;
    ad: PeripheralAD;
    value: any;
    onchange?: (position: number) => void;
    protected obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
}
export {};
