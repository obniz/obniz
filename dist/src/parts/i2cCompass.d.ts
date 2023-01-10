/**
 * @packageDocumentation
 * @module Parts
 */
import i2cParts, { I2cPartsAbstractOptions, Xyz } from './i2cParts';
export declare type compassUnit = 'uT' | 'G' | 'mT' | 'T' | 'mG' | 'kG' | 'uG';
export declare type I2cCompassAbstractOptions = I2cPartsAbstractOptions;
export default abstract class I2cCompassAbstract extends i2cParts {
    static calibrateWait(): Promise<void>;
    static headingWait(): Promise<void>;
    protected static unitScales: {
        G: number;
        uT: number;
        mT: number;
        T: number;
        mG: number;
        kG: number;
        uG: number;
    };
    protected abstract so: number;
    protected abstract sf: compassUnit;
    protected abstract range: string;
    protected abstract defaultUnit: compassUnit;
    abstract getAdcWait(): Promise<Xyz>;
    getWait(): Promise<Xyz>;
    getAdcArrayWait(): Promise<number[]>;
    getArrayWait(): Promise<number[]>;
    getUnit(): compassUnit;
    getRange(): string;
    setUnit(new_unit: compassUnit): void;
    private calcMag;
}
