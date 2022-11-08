/**
 * @packageDocumentation
 * @module Parts.CCS811
 */
import Obniz from '../../../obniz';
import { PullType } from '../../../obniz/libs/io_peripherals/common';
import { PeripheralIO } from '../../../obniz/libs/io_peripherals/io';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import i2cParts, { I2cInfo, I2cPartsAbstractOptions } from '../../i2cParts';
export interface CCS811Options extends I2cPartsAbstractOptions {
    pull?: PullType;
    nwak?: number;
    nrst?: number;
    nint?: number;
    add?: number;
    address?: number;
}
export default class CCS811 extends i2cParts implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    i2cinfo: I2cInfo;
    keys: string[];
    requiredKeys: string[];
    ioKeys?: string[] | undefined;
    params: any;
    commands: any;
    io_add?: PeripheralIO;
    io_nwak?: PeripheralIO;
    io_nrst?: PeripheralIO;
    constructor();
    i2cInfo(): I2cInfo;
    wired(obniz: Obniz): void;
    configWait(): Promise<void>;
    start(): void;
    setDriveModeWait(mode: number): Promise<void>;
    getMeasModeWait(): Promise<number>;
    getDriveModeWait(): Promise<number>;
    setEnvironmentalDataWait(relativeHumidity: number, temperature: number): Promise<void>;
    checkAvailableDataWait(): Promise<boolean>;
    readAlgorithmResultsWait(): Promise<{
        eCO2: number;
        TVOC: number;
    }>;
    geteCO2Wait(): Promise<number>;
    getTVOCWait(): Promise<number>;
    wake(): void;
    sleep(): void;
    hwResetWait(): Promise<void>;
}
