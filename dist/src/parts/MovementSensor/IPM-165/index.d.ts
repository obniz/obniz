declare class IPM_165 {
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
export default IPM_165;
