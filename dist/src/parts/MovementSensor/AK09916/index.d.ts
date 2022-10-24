/**
 * @packageDocumentation
 * @module Parts.AK09916
 */
import i2cParts, { I2cInfo, I2cPartsAbstractOptions } from '../../i2cParts';
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export declare type AK09916Options = I2cPartsAbstractOptions;
export default class AK09916 extends i2cParts implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    i2cinfo: I2cInfo;
    protected obniz: Obniz;
    private ADDR;
    private _WIA;
    private _HXL;
    private _HXH;
    private _HYL;
    private _HYH;
    private _HZL;
    private _HZH;
    private _ST2;
    private _CNTL2;
    private _ASAX;
    private _ASAY;
    private _ASAZ;
    private _MODE_POWER_DOWN;
    private MODE_SINGLE_MEASURE;
    private MODE_CONTINOUS_MEASURE_1;
    private MODE_CONTINOUS_MEASURE_2;
    private MODE_EXTERNAL_TRIGGER_MEASURE;
    private _MODE_SELF_TEST;
    private _MODE_FUSE_ROM_ACCESS;
    private OUTPUT_14_BIT;
    private OUTPUT_16_BIT;
    private _SO_14BIT;
    private _SO_16BIT;
    private so;
    private offset;
    private scale;
    constructor();
    wired(obniz: Obniz): void;
    /**
     * @deprecated
     */
    magnetic(): Promise<[number, number, number]>;
    magneticWait(): Promise<[number, number, number]>;
    whoamiWait(): Promise<number>;
    calibrateWait(count?: number, delay?: number): Promise<{
        offset: [number, number, number];
        scale: [number, number, number];
    }>;
}
