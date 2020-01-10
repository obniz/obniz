declare class LogicAnalyzer {
    obniz: any;
    onmeasured: any;
    params: any;
    measured: any;
    constructor(obniz: any);
    _reset(): void;
    start(params: any): void;
    end(): void;
    notified(obj: any): void;
}
export default LogicAnalyzer;
