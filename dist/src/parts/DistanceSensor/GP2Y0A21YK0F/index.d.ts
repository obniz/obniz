declare class GP2Y0A21YK0F {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    displayIoNames: any;
    _unit: any;
    obniz: any;
    params: any;
    io_signal: any;
    ad_signal: any;
    constructor();
    wired(obniz: any): void;
    start(callback: any): void;
    _volt2distance(val: any): any;
    getWait(): Promise<{}>;
    unit(unit: any): void;
}
export default GP2Y0A21YK0F;
