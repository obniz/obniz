import Obniz from "../../index";
interface LogicAnalyzerOptions {
    "io": number;
    "interval": number;
    "duration": number;
    "triggerValue": boolean;
    "triggerValueSamples": number;
}
interface LogicAnalyzerOptionsExt extends LogicAnalyzerOptions {
    "triggerValue": boolean;
    "triggerValueSamples": number;
}
declare class LogicAnalyzer {
    obniz: Obniz;
    onmeasured?: (array: number[]) => void;
    params: any;
    measured?: number[];
    constructor(obniz: Obniz);
    _reset(): void;
    start(params: LogicAnalyzerOptions | LogicAnalyzerOptionsExt): void;
    end(): void;
    notified(obj: any): void;
}
export default LogicAnalyzer;
