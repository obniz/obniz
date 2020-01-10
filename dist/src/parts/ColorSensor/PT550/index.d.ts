declare class PT550 {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    obniz: any;
    params: any;
    signal: any;
    onchange: any;
    constructor();
    wired(obniz: any): void;
    getWait(): Promise<any>;
}
export default PT550;
