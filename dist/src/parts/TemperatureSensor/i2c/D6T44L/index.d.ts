declare class D6T44L {
    static info(): {
        name: string;
    };
    requiredKeys: any;
    keys: any;
    address: any;
    ioKeys: any;
    commands: any;
    obniz: any;
    params: any;
    i2c: any;
    constructor();
    wired(obniz: any): void;
    getOnePixWait(pixcel: any): Promise<any>;
    getAllPixWait(): Promise<any>;
}
export default D6T44L;
