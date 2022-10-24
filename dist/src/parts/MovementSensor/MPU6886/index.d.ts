/**
 * @packageDocumentation
 * @module Parts.MPU6886
 */
import { I2cInfo } from '../../i2cParts';
import MPU6050, { MPU6050Options } from '../MPU6050';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export declare type MPU6886Options = MPU6050Options;
export default class MPU6886 extends MPU6050 {
    static info(): ObnizPartsInfo;
    i2cinfo: I2cInfo;
    constructor();
    init(): void;
    _reset(): void;
}
