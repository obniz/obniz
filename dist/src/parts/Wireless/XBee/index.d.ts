declare class XBee {
    static info(): {
        name: string;
    };
    keys: any;
    requiredKeys: any;
    displayIoNames: any;
    uart: any;
    currentCommand: any;
    commands: any;
    isAtMode: any;
    onFinishAtModeCallback: any;
    params: any;
    onreceive: any;
    obniz: any;
    constructor();
    wired(obniz: any): void;
    send(text: any): void;
    onAtResultsRecieve(data: any, text: any): void;
    addCommand(command: any, value?: any): void;
    sendCommand(): void;
    enterAtMode(): void;
    exitAtMode(): void;
    configWait(config: any): Promise<unknown>;
}
export default XBee;
