export = JoyStick;
declare class JoyStick {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    pins: string[];
    pinname: {
        sw: string;
    };
    shortName: string;
    wired(obniz: any): void;
    obniz: any;
    io_sig_sw: any;
    ad_x: any;
    ad_y: any;
    isPressedWait(): Promise<boolean>;
    getXWait(): Promise<number>;
    positionX: number | undefined;
    getYWait(): Promise<number>;
    positionY: number | undefined;
}
