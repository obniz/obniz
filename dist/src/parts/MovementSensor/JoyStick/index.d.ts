/**
 * @packageDocumentation
 * @module Parts.JoyStick
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface JoyStickOptions {
    sw: number;
    x: number;
    y: number;
    vcc?: number;
    gnd?: number;
}
export default class JoyStick implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    pins: any;
    pinname: any;
    shortName: any;
    positionX: any;
    positionY: any;
    onchangex?: (val: number) => void;
    onchangey?: (val: number) => void;
    isPressed: any;
    onchangesw?: (pressed: boolean) => void;
    protected obniz: Obniz;
    private io_sig_sw;
    private ad_x;
    private ad_y;
    constructor();
    wired(obniz: Obniz): void;
    isPressedWait(): Promise<boolean>;
    getXWait(): Promise<number>;
    getYWait(): Promise<number>;
}
