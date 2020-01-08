export = KXR94_2050;
declare class KXR94_2050 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): void;
    obniz: any;
    ad_x: any;
    ad_y: any;
    ad_z: any;
    _x_val: any;
    _y_val: any;
    _z_val: any;
    changeVccVoltage(pwrVoltage: any): void;
    sensitivity: number | undefined;
    offsetVoltage: number | undefined;
    voltage2gravity(volt: any): number;
    get(): {
        x: number;
        y: number;
        z: number;
    };
    _get(): {
        x: number;
        y: number;
        z: number;
    };
    getWait(): Promise<{
        x: number;
        y: number;
        z: number;
    }>;
}
