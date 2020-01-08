export = XBee;
declare class XBee {
    static info(): {
        name: string;
    };
    keys: string[];
    requiredKeys: string[];
    displayIoNames: {
        tx: string;
        rx: string;
    };
    wired(obniz: any): void;
    uart: any;
    currentCommand: string | null | undefined;
    commands: any[] | undefined;
    isAtMode: boolean | undefined;
    onFinishAtModeCallback: any;
    send(text: any): void;
    onAtResultsRecieve(data: any, text: any): void;
    addCommand(command: any, value: any): void;
    sendCommand(): void;
    enterAtMode(): void;
    exitAtMode(): void;
    configWait(config: any): Promise<any>;
}
