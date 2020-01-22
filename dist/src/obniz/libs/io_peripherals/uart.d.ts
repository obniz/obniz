import Obniz from "../../index";
import { BitType, DriveType, FlowControlType, ParityType, PullType, StopBitType } from "./common";
interface PeripheralUARTOptions {
    tx: number;
    rx: number;
    gnd?: number;
    baud?: number;
    stop?: StopBitType;
    bits?: BitType;
    parity?: ParityType;
    flowcontrol?: FlowControlType;
    rts?: number;
    cts?: number;
    drive?: DriveType;
    pull?: PullType;
}
declare class PeripheralUART {
    Obniz: Obniz;
    id: number;
    received: any;
    used: boolean;
    params: any;
    onreceive?: (data: any, text: string) => void;
    constructor(obniz: Obniz, id: number);
    _reset(): void;
    start(params: PeripheralUARTOptions): void;
    send(data: any): void;
    isDataExists(): boolean;
    readBytes(): number[];
    readByte(): number | null;
    readText(): string | null;
    tryConvertString(data: any): any;
    notified(obj: any): void;
    isUsed(): boolean;
    end(): void;
}
export default PeripheralUART;
