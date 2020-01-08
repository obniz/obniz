export = FullColorLED;
declare class FullColorLED {
    static info(): {
        name: string;
    };
    COMMON_TYPE_ANODE: number;
    COMMON_TYPE_CATHODE: number;
    anode_keys: string[];
    cathode_keys: string[];
    animationName: string;
    keys: string[];
    requiredKeys: string[];
    wired(obniz: any): void;
    obniz: any;
    commontype: number | undefined;
    common: any;
    pwmR: any;
    pwmG: any;
    pwmB: any;
    rgb(r: any, g: any, b: any): void;
    hsv(h: any, s: any, v: any): void;
    gradation(cycletime_ms: any): void;
    stopgradation(): void;
}
