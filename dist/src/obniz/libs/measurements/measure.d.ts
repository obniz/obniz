declare class ObnizMeasure {
    obniz: any;
    observers: any;
    params: any;
    constructor(obniz: any);
    _reset(): void;
    echo(params: any): void;
    notified(obj: any): void;
}
export default ObnizMeasure;
