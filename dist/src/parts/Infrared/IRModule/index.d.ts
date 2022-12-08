/**
 * @packageDocumentation
 * @module Parts.IRModule
 */
import Obniz from '../../../obniz';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import InfraredLED from '../InfraredLED';
import IRSensor from '../IRSensor';
export interface IRModuleOptions {
    send: number;
    recv: number;
    vcc?: number;
    gnd?: number;
}
export default class IRModule implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    sensor: IRSensor;
    led: InfraredLED;
    duration: any;
    dataInverted: any;
    cutTail: any;
    output_pullup: any;
    ondetect?: (array: number[]) => void;
    protected obniz: Obniz;
    get dataSymbolLength(): number;
    set dataSymbolLength(x: number);
    constructor();
    wired(obniz: Obniz): void;
    send(arr: any): void;
    start(callback?: (arr: any[]) => void): void;
    setGetterSetter(partsName: any, varName: any): void;
}
