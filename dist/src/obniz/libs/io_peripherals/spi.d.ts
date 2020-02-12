/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import Obniz from "../../index";
import { DriveType, PullType } from "./common";
interface PeripheralSPIOptions {
    mode: "master";
    clk?: number;
    mosi?: number;
    miso?: number;
    frequency: number;
    drive?: DriveType;
    pull?: PullType;
    gnd?: number;
}
export default class PeripheralSPI {
    Obniz: Obniz;
    id: number;
    observers: any[];
    used: boolean;
    params: PeripheralSPIOptions | null;
    constructor(obniz: Obniz, id: number);
    _reset(): void;
    addObserver(callback: any): void;
    start(params: PeripheralSPIOptions): void;
    writeWait(data: number[]): Promise<number[]>;
    write(data: number[]): void;
    notified(obj: any): void;
    isUsed(): boolean;
    end(reuse: any): void;
}
export {};
