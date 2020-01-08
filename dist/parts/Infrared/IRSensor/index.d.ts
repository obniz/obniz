export = IRSensor;
declare class IRSensor {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    dataSymbolLength: number;
    duration: number;
    dataInverted: boolean;
    triggerSampleCount: number;
    cutTail: boolean;
    output_pullup: boolean;
    wired(obniz: any): void;
    obniz: any;
    start(callback: any): void;
    ondetect: any;
}
