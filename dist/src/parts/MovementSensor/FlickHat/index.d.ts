/**
 * @packageDocumentation
 * @module Parts.FlickHat
 */
import Obniz from '../../../obniz';
import { PeripheralI2C } from '../../../obniz/libs/io_peripherals/i2c';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface FlickHatOptions {
    vcc?: number;
    sda: number;
    scl: number;
    reset: number;
    ts: number;
    gnd: number;
    led1?: number;
    led2?: number;
}
export declare type FlickHat_Direction = 'west' | 'east' | 'north' | 'south';
export declare type FlickHat_Direction2 = 'west' | 'east' | 'north' | 'south' | 'center';
export interface FlickHat_XYZ {
    x: number;
    y: number;
    z: number;
    seq: number;
}
export interface FlickHat_Gesture {
    action: 'gesture';
    from: FlickHat_Direction;
    to: FlickHat_Direction;
    seq: number;
    raw: any;
}
export interface FlickHat_Touch {
    action: 'touch';
    positions: FlickHat_Direction2[];
    seq: number;
    raw: any;
}
export interface FlickHat_Tap {
    action: 'tap';
    positions: FlickHat_Direction2[];
    seq: number;
    raw: any;
}
export interface FlickHat_DoubleTap {
    action: 'doubletap';
    positions: FlickHat_Direction2[];
    seq: number;
    raw: any;
}
export interface FlickHat_AirWheel {
    delta: number;
    rotation: number;
    seq: number;
    raw: any;
}
export default class FlickHat implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    displayIoNames: any;
    params: any;
    address: any;
    io_reset: any;
    io_ts: any;
    i2c: PeripheralI2C;
    led1: any;
    led2: any;
    onfwinfo?: (fwInfo: any) => void;
    fwInfo: any;
    rotation: any;
    lastRotation: any;
    readSize: any;
    debugprint: any;
    xyz: any;
    onxyz?: (xyz: FlickHat_XYZ) => void;
    lastGesture: any;
    ongestureall: any;
    ongesture?: (gesture: FlickHat_Gesture) => void;
    lastTouch: any;
    ontouch?: (touch: FlickHat_Touch) => void;
    ontap?: (tap: FlickHat_Tap) => void;
    ondoubletap: any;
    onairwheel?: (airwheel: FlickHat_AirWheel) => void;
    statusInfo: any;
    protected obniz: Obniz;
    constructor();
    wired(obniz: Obniz): void;
    /**
     * @deprecated
     * @param callback
     */
    start(callback?: (fwInfo: any) => void): Promise<void>;
    startWait(callback?: (fwInfo: any) => void): Promise<void>;
    _dataArray2string(data: any): any;
    /**
     * @deprecated
     * @param timeout
     */
    polling(timeout?: any): Promise<void>;
    pollingWait(timeout?: any): Promise<void>;
}
