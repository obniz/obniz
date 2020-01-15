import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface ArduCAMMiniOptions {
}
declare class ArduCAMMini implements ObnizPartsInterface {
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
    spi: any;
    i2c: any;
    _size: any;
    constructor();
    wired(obniz: Obniz): void;
    spi_write(addr: any, byteData: any): void;
    spi_readWait(addr: any): Promise<any>;
    i2c_byte_write(addr: any, byteData: any): void;
    i2c_regs_write(regs: any): void;
    spi_write_reg(addr: any, byteData: any): void;
    spi_read_regWait(addr: any): Promise<any>;
    spi_pingpongWait(): Promise<void>;
    setMode(mode: any): void;
    getChipIdWait(): Promise<any>;
    init(): void;
    startupWait(): Promise<void>;
    takeWait(size: any): Promise<any>;
    setSize(string: any): void;
    updateFIFO(data: any): void;
    flushFIFO(): void;
    readFIFOLengthWait(): Promise<number>;
    startCapture(): void;
    isCaptureDoneWait(): Promise<boolean>;
    readFIFOWait(): Promise<any>;
    arrayToBase64(array: any): string;
}
export default ArduCAMMini;
