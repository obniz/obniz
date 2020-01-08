export = CT10;
declare class CT10 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    onChangeForStateWait: () => void;
    wired(obniz: any): void;
    io_signal: any;
    io_vcc: any;
    io_supply: any;
    isNearWait(): Promise<any>;
    stateWait(isNear: any): Promise<any>;
}
