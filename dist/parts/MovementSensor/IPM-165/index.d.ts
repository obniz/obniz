export = IPM_165;
declare class IPM_165 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): void;
    obniz: any;
    signal: any;
    getWait(): Promise<any>;
}
