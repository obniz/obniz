export = _24LC256;
declare class _24LC256 {
    static info(): {
        name: string;
    };
    requiredKeys: string[];
    keys: string[];
    wired(obniz: any): void;
    i2c: any;
    set(address: any, data: any): void;
    getWait(address: any, length: any): Promise<any>;
}
