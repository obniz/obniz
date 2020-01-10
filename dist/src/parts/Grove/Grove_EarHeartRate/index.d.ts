declare class Grove_EarHeartRate {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    displayIoNames: any;
    interval: any;
    duration: any;
    obniz: any;
    params: any;
    constructor();
    wired(obniz: any): void;
    start(callback: any): void;
    getWait(): Promise<unknown>;
}
export default Grove_EarHeartRate;
