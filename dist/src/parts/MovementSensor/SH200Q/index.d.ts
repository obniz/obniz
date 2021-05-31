/**
 * @packageDocumentation
 * @module Parts.SH200Q
 */
import { I2cInfo, I2cPartsAbstractOptions } from '../../i2cParts';
import Obniz from '../../../obniz';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import I2cImu6, { Inertia6, Xyz } from '../../i2cImu6';
export declare type SH200QAccelRange = '4g' | '8g' | '16g';
export declare type SH200QGyroRange = '125dps' | '250dps' | '500dps' | '1000dps' | '2000dps';
export declare type SH200QOptions = I2cPartsAbstractOptions;
export default class SH200Q extends I2cImu6 {
    static commands: {
        whoami: number;
        whoami_result: number;
        acc_config: number;
        gyro_config: number;
        gyro_dlpf: number;
        fifo_config: number;
        acc_range: number;
        gyro_range: number;
        output_acc: number;
        output_gyro: number;
        output_temp: number;
        reg_set1: number;
        reg_set2: number;
        adc_reset: number;
        soft_reset: number;
        reset: number;
        accel_fs_sel: {
            '4g': number;
            '8g': number;
            '16g': number;
        };
        gyro_fs_sel: {
            '125dps': number;
            '250dps': number;
            '500dps': number;
            '1000dps': number;
            '2000dps': number;
        };
    };
    static info(): ObnizPartsInfo;
    i2cinfo: I2cInfo;
    constructor();
    wired(obniz: Obniz): void;
    _reset(): void;
    whoamiWait(): Promise<number>;
    initWait(): Promise<void>;
    setConfig(accelerometer_range: number, gyroscope_range: number): void;
    resetAdcWait(): Promise<void>;
    setAccelRange(accel_range: SH200QAccelRange): void;
    setGyroRange(gyro_range: SH200QGyroRange): void;
    calcTemp(data?: number | null | undefined): number | null;
    getAccelAdcWait(): Promise<Xyz>;
    getGyroAdcWait(): Promise<Xyz>;
    getTempAdcWait(): Promise<number>;
    getAllAdcWait(): Promise<Inertia6>;
}
