export = I2cPartsAbstruct;
declare class I2cPartsAbstruct {
    keys: string[];
    requiredKeys: any[];
    i2cinfo: {
        address: number;
        clock: number;
        voltage: string;
    };
    address: number;
    i2cInfo(): {
        address: number;
        clock: number;
        voltage: string;
    };
    wired(obniz: any): void;
    obniz: any;
    i2c: any;
    char2short(val1: any, val2: any): number;
    readWait(command: any, length: any): Promise<any>;
    readUint16Wait(command: any, length: any): Promise<any>;
    write(command: any, buf: any): void;
}
