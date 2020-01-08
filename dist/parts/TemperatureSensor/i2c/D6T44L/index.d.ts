export = D6T44L;
declare class D6T44L {
    static info(): {
        name: string;
    };
    requiredKeys: any[];
    keys: string[];
    address: number;
    ioKeys: string[];
    commands: {};
    wired(obniz: any): void;
    obniz: any;
    i2c: any;
    getOnePixWait(pixcel: any): Promise<number>;
    getAllPixWait(): Promise<number[]>;
}
