/**
 * @packageDocumentation
 * @module Parts.Button
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface ButtonOptions {
    signal: number;
    gnd?: number;
}
export default class Button implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    onChangeForStateWait: any;
    isPressed: boolean | null;
    onchange: ((pressed: boolean) => void) | null;
    private io_signal;
    private io_supply?;
    constructor();
    wired(obniz: Obniz): void;
    isPressedWait(): Promise<boolean>;
    stateWait(isPressed: boolean): Promise<void>;
}
