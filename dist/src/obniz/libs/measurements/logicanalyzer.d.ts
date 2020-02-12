/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import Obniz from "../../index";
export interface LogicAnalyzerOptions {
    "io": number;
    "interval": number;
    "duration": number;
}
export interface LogicAnalyzerOptionsExt extends LogicAnalyzerOptions {
    "triggerValue": boolean;
    "triggerValueSamples": number;
}
export default class LogicAnalyzer {
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
