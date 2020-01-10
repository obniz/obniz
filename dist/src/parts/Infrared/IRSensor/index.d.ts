declare class IRSensor {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    dataSymbolLength: any;
    duration: any;
    dataInverted: any;
    triggerSampleCount: any;
    cutTail: any;
    output_pullup: any;
    obniz: any;
    params: any;
    ondetect: any;
    constructor();
    wired(obniz: any): void;
    start(callback: any): void;
}
export default IRSensor;
