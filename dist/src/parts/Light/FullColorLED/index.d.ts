declare class FullColorLED {
    static info(): {
        name: string;
    };
    COMMON_TYPE_ANODE: any;
    COMMON_TYPE_CATHODE: any;
    anode_keys: any;
    cathode_keys: any;
    animationName: any;
    keys: any;
    requiredKeys: any;
    params: any;
    obniz: any;
    commontype: any;
    common: any;
    pwmR: any;
    pwmG: any;
    pwmB: any;
    constructor();
    wired(obniz: any): void;
    rgb(r: any, g: any, b: any): void;
    hsv(h: any, s: any, v: any): void;
    gradation(cycletime_ms: any): void;
    stopgradation(): void;
}
export default FullColorLED;
