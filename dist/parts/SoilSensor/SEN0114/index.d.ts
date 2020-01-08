export = SEN0114;
declare class SEN0114 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): void;
    obniz: any;
    ad: any;
    value: any;
    getHumidityWait(): Promise<any>;
}
