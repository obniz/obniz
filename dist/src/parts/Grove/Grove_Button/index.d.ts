/**
 * @packageDocumentation
 * @module Parts.Grove_Button
 */
import Obniz from '../../../obniz';
import { PeripheralGrove } from '../../../obniz/libs/io_peripherals/grove';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
interface Grove_ButtonOptionsA {
    signal: number;
    vcc?: number;
    gnd?: number;
}
interface Grove_ButtonOptionsB {
    grove: PeripheralGrove;
}
export declare type Grove_ButtonOptions = Grove_ButtonOptionsA | Grove_ButtonOptionsB;
export default class Grove_Button implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    isPressed: boolean | null;
    onchange: ((pressed: boolean) => void) | null;
    private io_vcc;
    private io_signal;
    private io_supply?;
    constructor();
    onChangeForStateWait: (pressed: boolean) => void;
    wired(obniz: Obniz): void;
    isPressedWait(): Promise<boolean>;
    stateWait(isPressed: boolean): Promise<void>;
}
export {};
