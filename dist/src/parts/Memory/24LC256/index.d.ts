declare class _24LC256 {
    static info(): {
        name: string;
    };
    requiredKeys: any;
    keys: any;
    params: any;
    i2c: any;
    obniz: any;
    constructor();
    wired(obniz: any): void;
    set(address: any, data: any): void;
    getWait(address: any, length: any): Promise<any>;
}
export default _24LC256;
