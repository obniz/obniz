export = FSR40X;
declare class FSR40X {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): void;
    obniz: any;
    io_pwr: any;
    ad: any;
    getWait(): Promise<number>;
    press: number | undefined;
}
