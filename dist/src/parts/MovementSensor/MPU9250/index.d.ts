/**
 * @packageDocumentation
 * @module Parts.MPU9250
 */
import Obniz from '../../../obniz';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import { Inertia6, Xyz } from '../../i2cImu6';
import AK8963 from '../AK8963';
import MPU6500, { MPU6500Options } from '../MPU6500';
export declare type MPU9250Options = MPU6500Options;
export default class MPU9250 extends MPU6500 {
    static info(): ObnizPartsInfo;
    ak8963: AK8963;
    constructor();
    wired(obniz: Obniz): void;
    init(): void;
    setConfig(accel_range: any, gyro_range: any, ADC_cycle: any): void;
    getAllAdcWait(): Promise<Inertia6>;
    getAllWait(): Promise<Inertia6>;
    getCompassWait(): Promise<Xyz>;
    getCompassAdcWait(): Promise<Xyz>;
    getCompassArrayWait(): Promise<number[]>;
    getCompassAdcArrayWait(): Promise<number[]>;
    getCompassUnit(): import("../../i2cCompass").compassUnit;
    getCompassRange(): string;
    getMagneticWait(): Promise<Xyz>;
    getMagneticAdcWait(): Promise<Xyz>;
    getMagneticArrayWait(): Promise<number[]>;
    getMagneticAdcArrayWait(): Promise<number[]>;
    getMagneticUnit(): import("../../i2cCompass").compassUnit;
    getMagneticRange(): string;
    private _getAK8963Wait;
}
