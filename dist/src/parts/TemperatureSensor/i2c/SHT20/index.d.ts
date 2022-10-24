/**
 * @packageDocumentation
 * @module Parts.SHT20
 */
import Obniz from '../../../../obniz';
import { PeripheralI2C } from '../../../../obniz/libs/io_peripherals/i2c';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../../obniz/ObnizPartsInterface';
import { I2cPartsAbstractOptions } from '../../../i2cParts';
export declare type SHT20Options = I2cPartsAbstractOptions;
export default class SHT20 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    requiredKeys: string[];
    keys: string[];
    params: any;
    ioKeys: string[];
    commands: {
        [key: string]: [number];
    };
    address: number;
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    constructor();
    wired(obniz: Obniz): void;
    /**
     * @deprecated
     * @param command
     */
    getData(command: [number]): Promise<number>;
    getDataWait(command: [number]): Promise<number>;
    getTempWait(): Promise<number>;
    getHumidWait(): Promise<number>;
    private checkCRC;
}
