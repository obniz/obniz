export = Grove_MP3;
declare class Grove_MP3 {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    ioKeys: string[];
    displayName: string;
    displayIoNames: {
        mp3_rx: string;
        mp3_tx: string;
    };
    wired(obniz: any): void;
    obniz: any;
    my_tx: any;
    my_rx: any;
    uart: any;
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
