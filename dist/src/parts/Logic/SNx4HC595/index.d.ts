/**
 * @packageDocumentation
 * @module Parts.SNx4HC595
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface SNx4HC595Options {
    gnd?: number;
    vcc?: number;
    ser: number;
    srclk: number;
    rclk: number;
    oe?: number;
    srclr?: number;
    io_num?: number;
    enabled?: boolean;
}
export default class SNx4HC595 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    autoFlash: any;
    params: any;
    protected obniz: Obniz;
    private io_ser;
    private io_srclk;
    private io_rclk;
    private io_srclr?;
    private io_oe?;
    private chip;
    private id;
    private value;
    private _io_num;
    private io;
    constructor();
    wired(obniz: Obniz): void;
    ioNum(num: number): void;
    isValidIO(io: number): boolean;
    getIO(io: number): any;
    output(id: any, value: any): void;
    onece(operation: any): void;
    setEnable(enable: boolean): void;
    flush(): void;
}
