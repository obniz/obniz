/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import Obniz from "../../index";
import { DriveType, PullType } from "./common";
export default class PeripheralIO {
    Obniz: Obniz;
    id: number;
    value: boolean;
    observers: Array<(value: boolean) => void>;
    onchange?: (value: boolean) => void;
    constructor(obniz: Obniz, id: number);
    _reset(): void;
    addObserver(callback: any): void;
    output(value: boolean): void;
    drive(drive: DriveType): void;
    pull(updown: PullType): void;
    input(callback: (value: boolean) => void): boolean;
    inputWait(): Promise<boolean>;
    end(): void;
    notified(obj: any): void;
}
