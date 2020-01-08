export = ObnizMeasure;
declare class ObnizMeasure {
    constructor(obniz: any);
    obniz: any;
    _reset(): void;
    observers: any[] | undefined;
    echo(params: any): void;
    params: any;
    notified(obj: any): void;
}
