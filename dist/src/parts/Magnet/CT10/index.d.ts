declare class CT10 {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    onChangeForStateWait: any;
    io_signal: any;
    params: any;
    io_vcc: any;
    io_supply: any;
    isNear: any;
    onchange: any;
    constructor();
    wired(obniz: any): void;
    isNearWait(): Promise<any>;
    stateWait(isNear: any): Promise<{}>;
}
export default CT10;
