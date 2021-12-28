/**
 * @packageDocumentation
 * @module Parts.HMC5883L
 */
import Obniz from '../../../obniz';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import i2cCompass, { compassUnit, I2cCompassAbstractOptions } from '../../i2cCompass';
import { I2cInfo, Xyz } from '../../i2cParts';
export declare type HMC5883LOptions = I2cCompassAbstractOptions;
export default class HMC5883L extends i2cCompass {
    static info(): ObnizPartsInfo;
    private static commands;
    private static scales;
    i2cinfo: I2cInfo;
    protected so: number;
    protected sf: compassUnit;
    protected range: string;
    protected defaultUnit: compassUnit;
    constructor();
    wired(obniz: Obniz): void;
    init(): void;
    reset(): void;
    getAdcWait(): Promise<Xyz>;
    setRange(index: number): void;
    /**
     * @deprecated
     */
    get(): Promise<Xyz>;
}
