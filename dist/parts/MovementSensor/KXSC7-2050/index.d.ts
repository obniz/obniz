export = KXSC7_2050;
declare class KXSC7_2050 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): Promise<void>;
    obniz: any;
    ad_x: any;
    ad_y: any;
    ad_z: any;
}
