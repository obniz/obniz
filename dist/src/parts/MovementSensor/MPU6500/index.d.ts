/**
 * @packageDocumentation
 * @module Parts.MPU6500
 */
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import MPU6050, { MPU6050Options } from '../MPU6050';
export declare type MPU6500Options = MPU6050Options;
export default class MPU6500 extends MPU6050 {
    static info(): ObnizPartsInfo;
    constructor();
    init(): void;
}
