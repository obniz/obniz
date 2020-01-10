export default class I2cPartsAbstruct {
    keys: any;
    requiredKeys: any;
    i2cinfo: any;
    address: any;
    obniz: any;
    params: any;
    i2c: any;
    constructor();
    i2cInfo(): {
        address: number;
        clock: number;
        voltage: string;
    };
    wired(obniz: any): void;
    char2short(val1: any, val2: any): any;
    readWait(command: any, length: any): Promise<any>;
    readUint16Wait(command: any, length: any): Promise<any>;
    write(command: any, buf: any): void;
}
