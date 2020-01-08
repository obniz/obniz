export = PT550;
declare class PT550 {
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
