declare class Grove_MP3 {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    ioKeys: any;
    displayName: any;
    displayIoNames: any;
    obniz: any;
    params: any;
    my_tx: any;
    my_rx: any;
    uart: any;
    constructor();
    wired(obniz: any): void;
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
