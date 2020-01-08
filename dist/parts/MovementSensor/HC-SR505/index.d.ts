export = HCSR505;
declare class HCSR505 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): void;
    obniz: any;
    io_signal: any;
    getWait(): any;
}
