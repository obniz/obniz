export = GP2Y0A21YK0F;
declare class GP2Y0A21YK0F {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    displayIoNames: {
        vcc: string;
        gnd: string;
        signal: string;
    };
    _unit: string;
    wired(obniz: any): void;
    obniz: any;
    io_signal: any;
    ad_signal: any;
    start(callback: any): void;
    _volt2distance(val: any): number;
    getWait(): Promise<any>;
    unit(unit: any): void;
}
