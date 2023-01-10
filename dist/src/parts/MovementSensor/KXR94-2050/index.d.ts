/**
 * @packageDocumentation
 * @module Parts.KXR94-2050
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface KXR94_2050Options {
    x: number;
    y: number;
    z: number;
    vcc?: number;
    gnd?: number;
    enable?: number;
    self_test?: number;
}
export default class KXR94_2050 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    sensitivity: any;
    offsetVoltage: any;
    onChange?: (value: {
        x: number;
        y: number;
        z: number;
    }) => void;
    onChangeX?: (x: number) => void;
    onChangeY?: (y: number) => void;
    onChangeZ?: (z: number) => void;
    protected obniz: Obniz;
    private ad_x;
    private ad_y;
    private ad_z;
    private _x_val;
    private _y_val;
    private _z_val;
    constructor();
    wired(obniz: Obniz): void;
    changeVccVoltage(pwrVoltage: number): void;
    voltage2gravity(volt: number): number;
    get(): {
        x: number;
        y: number;
        z: number;
    };
    _get(): {
        x: number;
        y: number;
        z: number;
    };
    getWait(): Promise<{
        x: number;
        y: number;
        z: number;
    }>;
}
