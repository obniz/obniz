declare class KXR94_2050 {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    obniz: any;
    params: any;
    ad_x: any;
    ad_y: any;
    ad_z: any;
    _x_val: any;
    onChangeX: any;
    onChange: any;
    _y_val: any;
    onChangeY: any;
    _z_val: any;
    onChangeZ: any;
    sensitivity: any;
    offsetVoltage: any;
    constructor();
    wired(obniz: any): void;
    changeVccVoltage(pwrVoltage: any): void;
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
export default KXR94_2050;
