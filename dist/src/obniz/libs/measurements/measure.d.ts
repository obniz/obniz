/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import Obniz from "../../index";
export interface ObnizMeasureResult {
    edge: boolean;
    timing: number;
}
declare type ObnizMeasureResultArray = [ObnizMeasureResult, ObnizMeasureResult];
export interface ObnizMeasureOptions {
    "io_pulse": number;
    "pulse": "positive" | "negative";
    "pulse_width": number;
    "io_echo": number;
    "measure_edges": number;
    "timeout"?: number;
    "callback"?: (edges: ObnizMeasureResultArray) => void;
}
export default class ObnizMeasure {
    obniz: Obniz;
    observers: Array<(edges: ObnizMeasureResultArray) => void>;
    params?: ObnizMeasureOptions;
    constructor(obniz: Obniz);
    _reset(): void;
    echo(params: ObnizMeasureOptions): void;
    notified(obj: any): void;
}
export {};
