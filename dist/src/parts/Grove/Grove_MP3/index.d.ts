import Obniz from "../../../obniz";
import ObnizPartsInterface from "../../../obniz/ObnizPartsInterface";
export interface Grove_MP3Options {
}
declare class Grove_MP3 implements ObnizPartsInterface {
    static info(): {
        name: string;
    };
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
    setVolume(vol: any): void;
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
export default Grove_MP3;
