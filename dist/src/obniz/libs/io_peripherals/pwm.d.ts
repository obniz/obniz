declare class PeripheralPWM {
    Obniz: any;
    id: any;
    state: any;
    used: any;
    params: any;
    constructor(Obniz: any, id: any);
    _reset(): void;
    sendWS(obj: any): void;
    start(params: any): void;
    freq(freq: any): void;
    pulse(pulse_width: any): void;
    duty(duty: any): void;
    isUsed(): any;
    end(): void;
    modulate(type: any, symbol_length: any, data: any): void;
}
export default PeripheralPWM;
