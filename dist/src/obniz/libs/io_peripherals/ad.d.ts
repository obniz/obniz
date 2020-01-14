import Obniz from "../../index";
declare class PeripheralAD {
    Obniz: Obniz;
    id: number;
    value: number;
    observers: Array<(value: number) => void>;
    onchange?: (value: number) => void;
    constructor(obniz: Obniz, id: number);
    _reset(): void;
    addObserver(callback: (value: number) => void): void;
    start(callback: any): number;
    getWait(): Promise<number>;
    end(): void;
    notified(obj: number): void;
}
export default PeripheralAD;
