export = Grove_EarHeartRate;
declare class Grove_EarHeartRate {
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
    interval: number;
    duration: number;
    wired(obniz: any): void;
    obniz: any;
    start(callback: any): void;
    getWait(): Promise<any>;
}
