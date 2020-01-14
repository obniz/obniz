import Obniz from "../../index";
import { DriveType, PullType } from "./common";
declare class PeripheralIO {
    Obniz: Obniz;
    id: number;
    value: boolean;
    observers: Array<(value: boolean) => void>;
    onchange?: (value: boolean) => void;
    constructor(obniz: any, id: any);
    _reset(): void;
    addObserver(callback: any): void;
    output(value: boolean): void;
    drive(drive: DriveType): void;
    pull(updown: PullType): void;
    input(callback: any): boolean;
    inputWait(): Promise<boolean>;
    end(): void;
    notified(obj: any): void;
}
export default PeripheralIO;
