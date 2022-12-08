/**
 * @packageDocumentation
 * @module Parts.M5StickC_JoyStick
 */
import Obniz from '../../../obniz';
import { PeripheralI2C } from '../../../obniz/libs/io_peripherals/i2c';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import { I2cPartsAbstractOptions } from '../../i2cParts';
export declare type M5StickC_JoyStickOptions = I2cPartsAbstractOptions;
export default class M5StickC_JoyStick implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    requiredKeys: string[];
    keys: string[];
    params: any;
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    constructor();
    wired(obniz: Obniz): void;
    getXWait(): Promise<number>;
    getYWait(): Promise<number>;
    isPressedWait(): Promise<boolean>;
    protected getXYWait(): Promise<number[]>;
}
