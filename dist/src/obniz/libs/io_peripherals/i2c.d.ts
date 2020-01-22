import Obniz from "../../index";
import { PullType } from "./common";
declare type I2CMode = "master" | "slave";
interface PeripheralI2CState {
    "mode": I2CMode;
    "sda": number;
    "scl": number;
    "pull"?: PullType;
    "gnd"?: number;
}
interface PeripheralI2COptions extends PeripheralI2CState {
    "mode": I2CMode;
    "sda": number;
    "scl": number;
    clock?: number;
    slave_address?: any;
    slave_address_length?: number;
}
declare class PeripheralI2C {
    Obniz: Obniz;
    id: number;
    onerror?: (error: any) => void;
    observers: any;
    state: PeripheralI2CState;
    used: boolean;
    onwritten?: (data: any[], address: string) => void;
    constructor(obniz: Obniz, id: number);
    _reset(): void;
    addObserver(callback: any): void;
    start(arg: PeripheralI2COptions): void;
    write(address: any, data: any): void;
    readWait(address: any, length: any): Promise<number[]>;
    notified(obj: any): void;
    isUsed(): boolean;
    end(): void;
}
export default PeripheralI2C;
