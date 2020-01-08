export = AMG8833;
declare class AMG8833 {
    static info(): {
        name: string;
    };
    requiredKeys: any[];
    keys: string[];
    ioKeys: string[];
    commands: {};
    wired(obniz: any): void;
    obniz: any;
    address: number | undefined;
    i2c: any;
    getOnePixWait(pixel: any): Promise<number>;
    getAllPixWait(): Promise<any[]>;
}
