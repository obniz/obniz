import Obniz from "../../index";
interface ObnizMeasureResult {
    edge: boolean;
    timing: number;
}
declare type ObnizMeasureResultArray = [ObnizMeasureResult, ObnizMeasureResult];
interface ObnizMeasureOptions {
    "io_pulse": number;
    "pulse": "positive" | "negative";
    "pulse_width": number;
    "io_echo": number;
    "measure_edges": number;
    "timeout"?: number;
    "callback"?: (edges: ObnizMeasureResultArray) => void;
}
declare class ObnizMeasure {
    obniz: Obniz;
    observers: Array<(edges: ObnizMeasureResultArray) => void>;
    params?: ObnizMeasureOptions;
    constructor(obniz: Obniz);
    _reset(): void;
    echo(params: ObnizMeasureOptions): void;
    notified(obj: any): void;
}
export default ObnizMeasure;
