/**
 * @packageDocumentation
 * @module Parts.Grove_MP3
 */
import Obniz from "../../../obniz";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface Grove_MP3Options {
    vcc?: number;
    gnd?: number;
    mp3_rx: number;
    mp3_tx: number;
}
export default class Grove_MP3 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    ioKeys: string[];
    displayName: any;
    displayIoNames: any;
    obniz: Obniz;
    params: any;
    my_tx: any;
    my_rx: any;
    uart: any;
    constructor();
    wired(obniz: Obniz): void;
    initWait(strage: any): Promise<void>;
    setVolume(vol: number): void;
    volUp(): void;
    volDown(): void;
    play(track: any, folder: any): void;
    stop(): void;
    pause(): void;
    resume(): void;
    next(): void;
    prev(): void;
    uartSend(command: any, param: any): any;
}
