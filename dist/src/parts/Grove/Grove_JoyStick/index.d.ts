/**
 * @packageDocumentation
 * @module Parts.Grove_JoyStick
 */
import Obniz from '../../../obniz';
import { PeripheralGrove } from '../../../obniz/libs/io_peripherals/grove';
import { PeripheralI2C } from '../../../obniz/libs/io_peripherals/i2c';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import { I2cPartsAbstractOptions } from '../../i2cParts';
interface GroveInterface {
    grove: PeripheralGrove;
}
export declare type Grove_JoyStickOptions = I2cPartsAbstractOptions | GroveInterface;
export default class Grove_JoyStick implements ObnizPartsInterface {
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
}
export {};
