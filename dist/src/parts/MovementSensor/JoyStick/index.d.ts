declare class JoyStick {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    pins: any;
    pinname: any;
    shortName: any;
    obniz: any;
    params: any;
    io_sig_sw: any;
    ad_x: any;
    ad_y: any;
    positionX: any;
    positionY: any;
    onchangex: any;
    onchangey: any;
    isPressed: any;
    onchangesw: any;
    constructor();
    wired(obniz: any): void;
    isPressedWait(): Promise<boolean>;
    getXWait(): Promise<number>;
    getYWait(): Promise<number>;
}
export default JoyStick;
