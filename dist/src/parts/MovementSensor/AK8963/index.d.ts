/**
 * @packageDocumentation
 * @module Parts.AK8963
 */
import Obniz from '../../../obniz';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import i2cCompass, { compassUnit, I2cCompassAbstractOptions } from '../../i2cCompass';
import { I2cInfo, Xyz } from '../../i2cParts';
export interface AK8963Options extends I2cCompassAbstractOptions {
    adc_cycle?: number;
}
export default class AK8963 extends i2cCompass {
    static info(): ObnizPartsInfo;
    private static scales;
    i2cinfo: I2cInfo;
    protected defaultUnit: compassUnit;
    protected sf: compassUnit;
    protected so: number;
    protected range: string;
    constructor();
    wired(obniz: Obniz): void;
    setConfig(ADC_cycle: number): void;
    getAdcWait(): Promise<Xyz>;
}
