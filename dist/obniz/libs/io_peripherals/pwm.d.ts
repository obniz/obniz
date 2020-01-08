export = PeripheralPWM;
declare class PeripheralPWM {
    constructor(Obniz: any, id: any);
    Obniz: any;
    id: any;
    _reset(): void;
    state: {
        io?: undefined;
        freq?: undefined;
    } | {
        io: any;
        freq: number;
    } | undefined;
    used: boolean | undefined;
    sendWS(obj: any): void;
    start(params: any): void;
    params: any;
    freq(freq: any): void;
    pulse(pulse_width: any): void;
    duty(duty: any): void;
    isUsed(): boolean | undefined;
    end(): void;
    modulate(type: any, symbol_length: any, data: any): void;
}
