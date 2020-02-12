/**
 * @packageDocumentation
 * @module Parts.Grove_3AxisAccelerometer
 */
import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface Grove_3AxisAccelerometerOptions {
    gnd?: number;
    vcc?: number;
    sda: number;
    scl: number;
}
export default class Grove_3AxisAccelerometer implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    ioKeys: string[];
    displayName: string;
    displayIoNames: {
        sda: string;
        scl: string;
    };
    address: number;
    regAdrs: any;
    constVal: any;
    params: any;
    protected obniz: Obniz;
    private vcc?;
    private gnd?;
    private i2c;
    private etRegisterBit;
    constructor();
    wired(obniz: any): Promise<void>;
    setRegisterBit(regAddr: any, bitPos: any, state: any): Promise<void>;
    setInterruptMapping(interruptBit: any, interruptPin: any): Promise<void>;
    setInterrupt(interruptBit: any, state: any): Promise<void>;
    signHandling(val: number): number;
    getRawVal(): Promise<number[]>;
    getWait(): Promise<number[]>;
}
