/**
 * @packageDocumentation
 * @module Parts.Keyestudio_Button
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface Keyestudio_ButtonOptions {
    signal: number;
    vcc?: number;
    gnd?: number;
}
export default class Keyestudio_Button implements ObnizPartsInterface {
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
