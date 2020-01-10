declare class SEN0114 {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    obniz: any;
    params: any;
    ad: any;
    value: any;
    onchange: any;
    constructor();
    wired(obniz: any): void;
    getHumidityWait(): Promise<any>;
}
export default SEN0114;
