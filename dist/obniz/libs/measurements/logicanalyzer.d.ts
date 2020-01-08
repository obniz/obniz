export = LogicAnalyzer;
declare class LogicAnalyzer {
    constructor(obniz: any);
    obniz: any;
    _reset(): void;
    onmeasured: any;
    start(params: any): void;
    params: any;
    end(): void;
    notified(obj: any): void;
    measured: any[] | undefined;
}
