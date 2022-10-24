/**
 * @packageDocumentation
 * @module Parts.JpegSerialCam
 */
import Obniz from '../../../obniz';
import { PeripheralUART } from '../../../obniz/libs/io_peripherals/uart';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface JpegSerialCamOptions {
    vcc?: number;
    cam_tx: number;
    cam_rx: number;
    gnd?: number;
}
export declare type JpegSerialCamSize = '640x480' | '320x240' | '160x120';
export declare type JpegSerialCamBaud = 9600 | 19200 | 38400 | 57600 | 115200;
export default class JpegSerialCam implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    ioKeys: string[];
    displayName: string;
    displayIoNames: any;
    obniz: Obniz;
    params: any;
    my_tx: any;
    my_rx: any;
    uart: PeripheralUART;
    constructor();
    wired(obniz: Obniz): void;
    _drainUntilWait(uart: PeripheralUART, search: number[], recv?: number[]): Promise<number[]>;
    _seekTail(search: number[], src: number[]): number;
    arrayToBase64(array: number[]): string;
    startWait(obj: any): Promise<void>;
    resetWait(): Promise<void>;
    setSizeWait(resolution: JpegSerialCamSize): Promise<void>;
    setCompressibilityWait(compress: number): Promise<void>;
    setBaudWait(baud: JpegSerialCamBaud): Promise<void>;
    takeWait(): Promise<number[]>;
}
