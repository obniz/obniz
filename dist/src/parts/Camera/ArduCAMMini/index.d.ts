/**
 * @packageDocumentation
 * @module Parts.ArduCAMMini
 */
import Obniz from '../../../obniz';
import { DriveType } from '../../../obniz/libs/io_peripherals/common';
import { PeripheralI2C } from '../../../obniz/libs/io_peripherals/i2c';
import { PeripheralSPI } from '../../../obniz/libs/io_peripherals/spi';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface ArduCAMMiniOptions {
    cs: number;
    mosi?: number;
    miso?: number;
    sclk?: number;
    gnd?: number;
    vcc?: number;
    sda?: number;
    scl?: number;
    i2c?: PeripheralI2C;
    spi?: PeripheralSPI;
    spi_drive?: DriveType;
    spi_frequency?: number;
    module_version?: number;
}
export declare type ArduCAMMiniMode = 'MCU2LCD' | 'CAM2LCD' | 'LCD2MCU';
export declare type ArduCAMMiniSize = '160x120' | '176x144' | '320x240' | '352x288' | '640x480' | '800x600' | '1024x768' | '1280x960' | '1600x1200';
export default class ArduCAMMini implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    ioKeys: string[];
    displayName: string;
    regs: any;
    configs: any;
    obniz: Obniz;
    params: any;
    io_cs: any;
    sensor_addr: any;
    _size: any;
    protected spi: PeripheralSPI;
    protected i2c: PeripheralI2C;
    constructor();
    wired(obniz: Obniz): void;
    spi_write(addr: number, byteData: number): void;
    spi_readWait(addr: number): Promise<number>;
    i2c_byte_write(addr: number, byteData: number): void;
    i2c_regs_write(regs: number[][]): void;
    spi_write_reg(addr: number, byteData: number): void;
    spi_read_regWait(addr: number): Promise<number>;
    spi_pingpongWait(): Promise<void>;
    setMode(mode: string): void;
    getChipIdWait(): Promise<number>;
    init(): void;
    startupWait(): Promise<void>;
    takeWait(size?: string): Promise<number[]>;
    setSize(string: string): void;
    updateFIFO(data: any): void;
    flushFIFO(): void;
    readFIFOLengthWait(): Promise<number>;
    startCapture(): void;
    isCaptureDoneWait(): Promise<boolean>;
    readFIFOWait(): Promise<number[]>;
    arrayToBase64(array: number[]): string;
}
