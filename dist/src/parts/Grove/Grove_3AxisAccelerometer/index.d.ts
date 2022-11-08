/**
 * @packageDocumentation
 * @module Parts.Grove_3AxisAccelerometer
 */
import Obniz from '../../../obniz';
import { PeripheralGrove } from '../../../obniz/libs/io_peripherals/grove';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
interface Grove_3AxisAccelerometerOptionsA {
    gnd?: number;
    vcc?: number;
    sda: number;
    scl: number;
}
interface Grove_3AxisAccelerometerOptionsB {
    grove: PeripheralGrove;
}
export declare type Grove_3AxisAccelerometerOptions = Grove_3AxisAccelerometerOptionsA | Grove_3AxisAccelerometerOptionsB;
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
    wired(obniz: any): void;
    initWait(): Promise<void>;
    /**
     * @deprecated
     * @param regAddr
     * @param bitPos
     * @param state
     */
    setRegisterBit(regAddr: any, bitPos: any, state: any): Promise<void>;
    setRegisterBitWait(regAddr: any, bitPos: any, state: any): Promise<void>;
    /**
     * @deprecated
     * @param interruptBit
     * @param interruptPin
     */
    setInterruptMapping(interruptBit: any, interruptPin: any): Promise<void>;
    setInterruptMappingWait(interruptBit: any, interruptPin: any): Promise<void>;
    /**
     * @deprecated
     */
    setInterrupt(interruptBit: any, state: any): Promise<void>;
    setInterruptWait(interruptBit: any, state: any): Promise<void>;
    signHandling(val: number): number;
    /**
     * @deprecated
     */
    getRawVal(): Promise<number[]>;
    getRawValWait(): Promise<number[]>;
    getWait(): Promise<number[]>;
}
export {};
