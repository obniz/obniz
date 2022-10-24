/**
 * @packageDocumentation
 * @module Parts.Grove_MicroSwitch
 */
import Obniz from '../../../obniz';
import { PeripheralGrove } from '../../../obniz/libs/io_peripherals/grove';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
interface Grove_MicroSwitchOptionsA {
    signal: number;
    vcc?: number;
    gnd?: number;
}
interface Grove_MicroSwitchOptionsB {
    grove: PeripheralGrove;
}
export declare type Grove_MicroSwitchOptions = Grove_MicroSwitchOptionsA | Grove_MicroSwitchOptionsB;
export default class Grove_MicroSwitch implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    isPressed: boolean | null;
    onchange: ((pressed: boolean) => void) | null;
    private io_signal;
    constructor();
    onChangeForStateWait: (pressed: boolean) => void;
    wired(obniz: Obniz): void;
    isPressedWait(): Promise<boolean>;
    stateWait(isPressed: boolean): Promise<void>;
}
export {};
