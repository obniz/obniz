declare class AMG8833 {
    static info(): {
        name: string;
    };
    requiredKeys: any;
    keys: any;
    ioKeys: any;
    commands: any;
    obniz: any;
    params: any;
    address: any;
    i2c: any;
    constructor();
    wired(obniz: any): void;
    getOnePixWait(pixel: any): Promise<number>;
    getAllPixWait(): Promise<any>;
}
export default AMG8833;
