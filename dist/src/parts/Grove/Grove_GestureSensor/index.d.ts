/**
 * @packageDocumentation
 * @module Parts.Grove_GestureSensor
 */
import Obniz from '../../../obniz';
import { PeripheralGrove } from '../../../obniz/libs/io_peripherals/grove';
import { PeripheralI2C } from '../../../obniz/libs/io_peripherals/i2c';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import { I2cPartsAbstractOptions } from '../../i2cParts';
interface GroveInterface {
    grove: PeripheralGrove;
}
export declare type Grove_GestureSensorOptions = I2cPartsAbstractOptions | GroveInterface;
export default class Grove_GestureSensor implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    requiredKeys: string[];
    keys: string[];
    params: any;
    GESTURE_RIGHT: string;
    GESTURE_LEFT: string;
    GESTURE_UP: string;
    GESTURE_DOWN: string;
    GESTURE_FORWARD: string;
    GESTURE_BACKWARD: string;
    GESTURE_CLOCKWISE: string;
    GESTURE_COUNT_CLOCKWISE: string;
    protected obniz: Obniz;
    protected i2c: PeripheralI2C;
    private ic2Address;
    private PAJ7620_ADDR_BASE;
    private PAJ7620_REGITER_BANK_SEL;
    private PAJ7620_BANK0;
    private PAJ7620_BANK1;
    private GES_RIGHT_FLAG;
    private GES_LEFT_FLAG;
    private GES_UP_FLAG;
    private GES_DOWN_FLAG;
    private GES_FORWARD_FLAG;
    private GES_BACKWARD_FLAG;
    private GES_CLOCKWISE_FLAG;
    private GES_COUNT_CLOCKWISE_FLAG;
    private GES_WAVE_FLAG;
    private initRegisterArray;
    constructor();
    onchange(value: string): void;
    wired(obniz: Obniz): void;
    initWait(): Promise<void>;
    private checkWakeUpWait;
    private initRegisterWait;
}
export {};
