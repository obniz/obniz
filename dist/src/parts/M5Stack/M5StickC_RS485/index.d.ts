/**
 * @packageDocumentation
 * @module Parts.M5StackC_RS485
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface M5StickC_RS485Options {
    tx: number;
    rx: number;
    gnd?: number;
    vcc?: number;
    baud?: number;
}
export default class M5StickC_RS485 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    onreceive?: (data: any, text: string) => void;
    protected obniz: Obniz;
    private uart;
    constructor();
    wired(obniz: Obniz): void;
    send(data: any): void;
}
